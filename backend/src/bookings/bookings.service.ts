import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  async createBooking(customerId: number, createBookingDto: CreateBookingDto) {
    return await db.transaction(async (tx) => {
      // Find TripDate
      const tripDate = await tx.orm.public.TripDate
        .where({ id: createBookingDto.tripDateId })
        .first();

      if (!tripDate) {
        throw new NotFoundException('Trip date not found');
      }

      if (tripDate.capacity - tripDate.bookedSeats < 1) {
        throw new ConflictException('No seats available');
      }

      // Update bookedSeats natively via raw SQL as Prisma 8 doesn't give a native way to increment 
      try {
        // @ts-ignore
        await tx.execute(db.raw.sql`
          UPDATE "public"."tripDate" 
          SET "bookedSeats" = "bookedSeats" + 1 
          WHERE "id" = ${tripDate.id}
        `.affectedCount().build());
      } catch (error: any) {
        if (error.message?.includes('tripdate_capacity_check') || String(error).includes('violates check constraint')) {
          throw new ConflictException('Seat was just taken by another user. No seats available.');
        }
        throw error;
      }

      // Create Booking
      const booking = await tx.orm.public.Booking.create({
        customerId,
        tripId: tripDate.tripId,
        tripDateId: tripDate.id,
        price: tripDate.price,
        status: 'Confirmed'
      });

      return booking;
    });
  }

  async getBookings(customerId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await db.orm.public.Booking
      .where({ customerId })
      .orderBy((b) => b.createdAt.desc())
      .offset(skip)
      .limit(limit)
      .all();
  }

  async getBooking(customerId: number, bookingId: number) {
    const booking = await db.orm.public.Booking
      .where({ id: bookingId })
      .first();

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
      const booking = await tx.orm.public.Booking
        .where({ id: bookingId })
        .first();

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.customerId !== customerId) {
        throw new ForbiddenException('You can only cancel your own bookings');
      }

      if (booking.status === 'Cancelled') {
        throw new ConflictException('Booking is already cancelled');
      }

      const tripDate = await tx.orm.public.TripDate.where({ id: booking.tripDateId }).first();
      const trip = await tx.orm.public.Trip.where({ id: booking.tripId }).first();

      if (!tripDate || !trip) {
         throw new NotFoundException('Trip or TripDate not found');
      }

      // Check cancellation window
      const tripStartDate = new Date(tripDate.startDate);
      const cancellationWindowHours = trip.cancellationWindowHours;
      const cancellationDeadline = new Date(tripStartDate.getTime() - (cancellationWindowHours * 60 * 60 * 1000));

      if (new Date() > cancellationDeadline) {
        throw new ConflictException(`Cancellation window has passed (must be cancelled ${cancellationWindowHours} hours before trip starts)`);
      }

      // Update Booking status
      const updatedBooking = await tx.orm.public.Booking
        .where({ id: bookingId })
        .update({ status: 'Cancelled' });

      // Release seat natively via raw SQL
      // @ts-ignore
      await tx.execute(db.raw.sql`
        UPDATE "public"."tripDate" 
        SET "bookedSeats" = "bookedSeats" - 1 
        WHERE "id" = ${tripDate.id}
      `.affectedCount().build());

      return updatedBooking;
    });
  }
}
