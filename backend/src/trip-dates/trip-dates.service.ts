import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BOOKING_SEATS_PROVIDER,
  type BookingSeatsProvider,
} from '../bookings/booking-seats.port.js';
import { db } from '../prisma/db.js';
import type { Models } from '../prisma/contract.d';
import {
  DEFAULT_TRIP_DATES_LIMIT,
  DEFAULT_TRIP_DATES_PAGE,
  type TripDateQueryDto,
} from './dto/trip-date-query.dto.js';
import type { CreateTripDateDto } from './dto/create-trip-date.dto.js';
import type { UpdateTripDateDto } from './dto/update-trip-date.dto.js';

export type TripDateRow = Omit<Models.public_TripDate, 'trip' | 'bookings'>;

/**
 * API shape: price is a JSON number. Storage is numeric(10,2) and reads back
 * as a decimal string, so every response maps it via Number() (exact for
 * 2-decimal money, far below 2^53).
 */
export interface TripDateResponse extends Omit<TripDateRow, 'price'> {
  price: number;
}

export interface TripDatesMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedTripDates {
  data: TripDateResponse[];
  meta: TripDatesMeta;
}

/**
 * Detect a CHECK-constraint violation (Postgres SQLSTATE 23514). The service
 * validates first, so this is only a backstop mapped to 400.
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

export interface TripDateAvailability {
  tripId: number;
  dateId: number;
  capacity: number;
  bookedSeats: number;
  remainingSeats: number;
  available: boolean;
}

@Injectable()
export class TripDatesService {
  constructor(
    @Inject(BOOKING_SEATS_PROVIDER)
    private readonly bookedSeats: BookingSeatsProvider,
  ) {}

  async findAll(
    tripId: number,
    query: TripDateQueryDto,
  ): Promise<PaginatedTripDates> {
    await this.assertActiveTrip(tripId);

    const page = query.page ?? DEFAULT_TRIP_DATES_PAGE;
    const limit = query.limit ?? DEFAULT_TRIP_DATES_LIMIT;

    const [rows, total] = await db.transaction(async (tx) => {
      // One filter builder feeds both queries, so page and total cannot
      // diverge.
      const buildBase = () =>
        tx.orm.public.TripDate.where((d) => d.tripId.eq(tripId)).where((d) =>
          d.isActive.eq(true),
        );
      const data = await buildBase()
        .orderBy((d) => d.startDate.asc())
        .limit(limit)
        .offset((page - 1) * limit)
        .all();

      const { total } = await buildBase().aggregate((a) => ({
        total: a.count(),
      }));

      return [data, total] as const;
    });

    return {
      data: rows.map(toResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async findOne(tripId: number, dateId: number): Promise<TripDateResponse> {
    await this.assertActiveTrip(tripId);
    const date = await this.findScoped(tripId, dateId);
    if (!date || !date.isActive) {
      throw new NotFoundException(
        `Trip date with id ${dateId} not found for trip with id ${tripId}`,
      );
    }
    return toResponse(date);
  }

  async create(
    tripId: number,
    dto: CreateTripDateDto,
  ): Promise<TripDateResponse> {
    await this.assertActiveTrip(tripId);
    assertChronology(dto.startDate, dto.endDate);

    try {
      // The mutation input types price as its decimal-string codec form;
      // the driver also coerces numbers, but the string is canonical.
      const created = await db.orm.public.TripDate.create({
        tripId,
        startDate: dto.startDate,
        endDate: dto.endDate,
        price: dto.price.toString(),
        capacity: dto.capacity,
      });
      return toResponse(created);
    } catch (error) {
      if (isCheckViolation(error)) {
        throw new BadRequestException(
          'Trip date violates capacity, price or date-range rules',
        );
      }
      throw error;
    }
  }

  async update(
    tripId: number,
    dateId: number,
    dto: UpdateTripDateDto,
  ): Promise<TripDateResponse> {
    const existing = await this.findScoped(tripId, dateId);
    if (!existing) {
      throw new NotFoundException(
        `Trip date with id ${dateId} not found for trip with id ${tripId}`,
      );
    }

    const startDate = dto.startDate ?? existing.startDate;
    const endDate = dto.endDate ?? existing.endDate;
    assertChronology(startDate, endDate);

    if (dto.capacity !== undefined) {
      const booked = await this.bookedSeats.getConfirmedBookedSeats(dateId);
      if (dto.capacity < booked) {
        throw new ConflictException(
          `Capacity ${dto.capacity} is below ${booked} already-booked seats`,
        );
      }
    }

    const hasChanges =
      dto.startDate !== undefined ||
      dto.endDate !== undefined ||
      dto.price !== undefined ||
      dto.capacity !== undefined ||
      dto.isActive !== undefined;
    if (!hasChanges) {
      return toResponse(existing);
    }

    try {
      await db.orm.public.TripDate.where({ id: dateId }).update({
        ...(dto.startDate !== undefined ? { startDate: dto.startDate } : {}),
        ...(dto.endDate !== undefined ? { endDate: dto.endDate } : {}),
        ...(dto.price !== undefined ? { price: dto.price.toString() } : {}),
        ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      });
    } catch (error) {
      if (isCheckViolation(error)) {
        throw new BadRequestException(
          'Trip date violates capacity, price or date-range rules',
        );
      }
      throw error;
    }
    const updated = await this.findScoped(tripId, dateId);
    // The row cannot vanish between update and re-read; guard anyway.
    if (!updated) {
      throw new NotFoundException(
        `Trip date with id ${dateId} not found for trip with id ${tripId}`,
      );
    }
    return toResponse(updated);
  }

  /**
   * Computed availability — nothing is stored. remainingSeats is derived as
   * capacity minus confirmed booked seats (Backend 3's counts via the port;
   * 0 until the real provider lands), clamped at 0 so overbooking data can
   * never surface a negative remainder.
   */
  async getAvailability(
    tripId: number,
    dateId: number,
  ): Promise<TripDateAvailability> {
    const date = await this.findOne(tripId, dateId);
    const bookedSeats = await this.bookedSeats.getConfirmedBookedSeats(dateId);
    const remainingSeats = Math.max(0, date.capacity - bookedSeats);
    return {
      tripId,
      dateId,
      capacity: date.capacity,
      bookedSeats,
      remainingSeats,
      available: remainingSeats > 0,
    };
  }

  /**
   * Soft-delete: deactivates instead of hard-deleting so bookings that
   * reference the date never break. Idempotent.
   */
  async remove(tripId: number, dateId: number): Promise<TripDateResponse> {
    const existing = await this.findScoped(tripId, dateId);
    if (!existing) {
      throw new NotFoundException(
        `Trip date with id ${dateId} not found for trip with id ${tripId}`,
      );
    }
    if (!existing.isActive) {
      return toResponse(existing);
    }
    await db.orm.public.TripDate.where({ id: dateId }).update({
      isActive: false,
    });
    const updated = await this.findScoped(tripId, dateId);
    return toResponse(updated ?? { ...existing, isActive: false });
  }

  /** Scoped lookup: a date is only visible through its own trip. */
  private async findScoped(
    tripId: number,
    dateId: number,
  ): Promise<TripDateRow | null> {
    return db.orm.public.TripDate.where((d) => d.tripId.eq(tripId))
      .where((d) => d.id.eq(dateId))
      .first();
  }

  /**
   * Inactive trips are invisible: dates can only be listed/read for trips
   * that public GETs would return. Writes use requireTrip instead.
   */
  private async assertActiveTrip(tripId: number): Promise<void> {
    const trip = await db.orm.public.Trip.first({ id: tripId });
    if (!trip || !trip.isActive) {
      throw new NotFoundException(`Trip with id ${tripId} not found`);
    }
  }
}

function toResponse(row: TripDateRow): TripDateResponse {
  return { ...row, price: Number(row.price) };
}

/** Compare instants numerically; string comparison is format-fragile. */
function assertChronology(startDate: string, endDate: string): void {
  if (Date.parse(endDate) < Date.parse(startDate)) {
    throw new BadRequestException('endDate must be on or after startDate');
  }
}
