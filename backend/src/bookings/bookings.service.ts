import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

/**
 * Bounded compare-and-swap retries for seat claims/releases. Contention on
 * the last seat (or a concurrent cancel) fails the version predicate and
 * retries with a fresh read instead of failing the booking outright.
 */
const SEAT_UPDATE_ATTEMPTS = 5;

/**
 * Detect a CHECK-constraint violation (Postgres SQLSTATE 23514). The service
 * validates first, so this is only a backstop mapped to 409.
 */
function isCheckViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const record = error as Record<string, unknown>;
  if (record['sqlState'] === '23514' || record['code'] === '23514') {
    return true;
  }
  return (
    typeof record['message'] === 'string' &&
    /check constraint/i.test(record['message'])
  );
}

@Injectable()
export class BookingsService {
  async createBooking(customerId: number, createBookingDto: CreateBookingDto) {
    return await db.transaction(async (tx) => {
      const initial = await tx.orm.public.TripDate.where({
        id: createBookingDto.tripDateId,
      }).first();

      if (!initial) {
        throw new NotFoundException('Trip date not found');
      }

      const trip = await tx.orm.public.Trip.where({
        id: initial.tripId,
      }).first();

      // Inactive trips and dates are invisible, mirroring the trip-dates reads.
      if (!trip || !trip.isActive || !initial.isActive) {
        throw new NotFoundException('Trip date not found');
      }

      if (Date.parse(initial.startDate) <= Date.now()) {
        throw new BadRequestException('Cannot book a past trip date');
      }

      // Atomic seat claim: conditional update on the previously read
      // bookedSeats value. A concurrent claim changes the value, matches
      // zero rows, and retries with a fresh read. The
      // tripdate_capacity_check constraint remains as a final backstop.
      let snapshot = initial;
      let claimed = false;
      for (let attempt = 0; attempt < SEAT_UPDATE_ATTEMPTS; attempt += 1) {
        if (snapshot.bookedSeats >= snapshot.capacity) {
          throw new ConflictException('No seats available');
        }
        let updated;
        try {
          updated = await tx.orm.public.TripDate.where({ id: snapshot.id })
            .where((d) => d.bookedSeats.eq(snapshot.bookedSeats))
            .update({ bookedSeats: snapshot.bookedSeats + 1 });
        } catch (error) {
          if (isCheckViolation(error)) {
            throw new ConflictException('No seats available');
          }
          throw error;
        }
        if (updated !== null) {
          claimed = true;
          break;
        }
        const reread = await tx.orm.public.TripDate.where({
          id: snapshot.id,
        }).first();
        if (!reread) {
          throw new NotFoundException('Trip date not found');
        }
        snapshot = reread;
      }
      if (!claimed) {
        throw new ConflictException(
          'Seat was just taken by another user. No seats available.',
        );
      }

      // Create Booking
      const booking = await tx.orm.public.Booking.create({
        customerId,
        tripId: snapshot.tripId,
        tripDateId: snapshot.id,
        price: snapshot.price,
        status: 'Confirmed',
      });

      return booking;
    });
  }

  async getBookings(customerId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await db.orm.public.Booking.where({ customerId })
      .orderBy((b) => b.createdAt.desc())
      .offset(skip)
      .limit(limit)
      .all();
  }

  async getBooking(customerId: number, bookingId: number) {
    const booking = await db.orm.public.Booking.where({
      id: bookingId,
    }).first();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customerId !== customerId) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return booking;
  }

  async getBookingStatus(customerId: number, bookingId: number) {
    const booking = await this.getBooking(customerId, bookingId);
    return { status: booking.status };
  }

  async cancelBooking(customerId: number, bookingId: number) {
    return await db.transaction(async (tx) => {
      const booking = await tx.orm.public.Booking.where({
        id: bookingId,
      }).first();

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.customerId !== customerId) {
        throw new ForbiddenException('You can only cancel your own bookings');
      }

      if (booking.status === 'Cancelled') {
        throw new ConflictException('Booking is already cancelled');
      }

      const tripDate = await tx.orm.public.TripDate.where({
        id: booking.tripDateId,
      }).first();
      const trip = await tx.orm.public.Trip.where({
        id: booking.tripId,
      }).first();

      if (!tripDate || !trip) {
        throw new NotFoundException('Trip or TripDate not found');
      }

      // Check cancellation window
      const tripStartDate = new Date(tripDate.startDate);
      const cancellationWindowHours = trip.cancellationWindowHours;
      const cancellationDeadline = new Date(
        tripStartDate.getTime() - cancellationWindowHours * 60 * 60 * 1000,
      );

      if (new Date() > cancellationDeadline) {
        throw new ConflictException(
          `Cancellation window has passed (must be cancelled ${cancellationWindowHours} hours before trip starts)`,
        );
      }

      // Flip Confirmed -> Cancelled conditionally: a concurrent cancel
      // matches zero rows and surfaces as already-cancelled below.
      const cancelled = await tx.orm.public.Booking.where({ id: bookingId })
        .where((b) => b.status.eq('Confirmed'))
        .update({ status: 'Cancelled' });
      if (cancelled === null) {
        const reread = await tx.orm.public.Booking.where({
          id: bookingId,
        }).first();
        if (!reread) {
          throw new NotFoundException('Booking not found');
        }
        if (reread.customerId !== customerId) {
          throw new ForbiddenException('You can only cancel your own bookings');
        }
        throw new ConflictException('Booking is already cancelled');
      }

      // Release the seat with the same compare-and-swap, guarded at zero
      // so a data anomaly can never drive bookedSeats negative.
      for (let attempt = 0; attempt < SEAT_UPDATE_ATTEMPTS; attempt += 1) {
        const current = await tx.orm.public.TripDate.where({
          id: tripDate.id,
        }).first();
        if (!current || current.bookedSeats <= 0) {
          break;
        }
        let released;
        try {
          released = await tx.orm.public.TripDate.where({ id: current.id })
            .where((d) => d.bookedSeats.eq(current.bookedSeats))
            .update({ bookedSeats: current.bookedSeats - 1 });
        } catch (error) {
          if (isCheckViolation(error)) {
            break;
          }
          throw error;
        }
        if (released !== null) {
          break;
        }
      }

      return cancelled;
    });
  }
}
