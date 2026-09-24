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
import { escapeLikePattern } from '../common/like-pattern.js';
import { or } from '@prisma/orm-postgres/orm-client';
import { db } from '../prisma/db.js';
import type { Models } from '../prisma/contract.d';
import type { AssignOperatorDto } from './dto/assign-operator.dto.js';
import type { CreateTripDto } from './dto/create-trip.dto.js';
import {
  DEFAULT_TRIPS_LIMIT,
  DEFAULT_TRIPS_PAGE,
  type TripQueryDto,
  type TripSort,
} from './dto/trip-query.dto.js';
import type { UpdateTripDto } from './dto/update-trip.dto.js';
import type { TripDateRow } from '../trip-dates/trip-dates.service.js';

export type TripDestination = Omit<Models.public_Destination, 'trips'>;
// 'destination' is nullable in the type (LEFT JOIN semantics) even though the
// FK guarantees a row in practice. Omit 'trips': never included on the branch.
// Omit 'dates': the back-relation is only populated via .include().
export type Trip = Omit<Models.public_Trip, 'destination' | 'dates'> & {
  destination: TripDestination | null;
};
export type TripSummary = Omit<Models.public_Trip, 'destination' | 'dates'>;

export interface TripsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedTrips {
  data: TripSummary[];
  meta: TripsMeta;
}

export interface PaginatedTripDetails {
  data: Trip[];
  meta: TripsMeta;
}

export interface TripOperator {
  operatorId: number;
}

export interface TripSearchCriteria {
  text?: string;
  destinationId?: number;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  availableOnly?: boolean;
  sort?: TripSort;
  page?: number;
  limit?: number;
}

interface DayBounds {
  start: number;
  end: number;
}

interface DateFilters {
  dayBounds?: DayBounds;
  minPrice?: number;
  maxPrice?: number;
}

function groupDatesByTrip(rows: TripDateRow[]): Map<number, TripDateRow[]> {
  const datesByTrip = new Map<number, TripDateRow[]>();
  for (const row of rows) {
    const bucket = datesByTrip.get(row.tripId) ?? [];
    bucket.push(row);
    datesByTrip.set(row.tripId, bucket);
  }
  return datesByTrip;
}

/** Keep, per trip, the dates inside the day overlap + price window. */
function qualifyDatesByTrip(
  datesByTrip: Map<number, TripDateRow[]>,
  filters: DateFilters,
): Map<number, TripDateRow[]> {
  const qualifying = new Map<number, TripDateRow[]>();
  for (const [tripId, rows] of datesByTrip) {
    qualifying.set(
      tripId,
      rows.filter((row) => {
        if (filters.dayBounds) {
          const start = Date.parse(row.startDate);
          const end = Date.parse(row.endDate);
          if (start > filters.dayBounds.end || end < filters.dayBounds.start) {
            return false;
          }
        }
        const price = Number(row.price);
        if (filters.minPrice !== undefined && price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && price > filters.maxPrice) {
          return false;
        }
        return true;
      }),
    );
  }
  return qualifying;
}

function minPriceOf(
  qualifying: Map<number, TripDateRow[]>,
  tripId: number,
): number | undefined {
  let best: number | undefined;
  for (const row of qualifying.get(tripId) ?? []) {
    const price = Number(row.price);
    if (best === undefined || price < best) best = price;
  }
  return best;
}

function earliestOf(
  qualifying: Map<number, TripDateRow[]>,
  tripId: number,
): number | undefined {
  let best: number | undefined;
  for (const row of qualifying.get(tripId) ?? []) {
    const start = Date.parse(row.startDate);
    if (best === undefined || start < best) best = start;
  }
  return best;
}

/** Sort a copy; trips without rankable dates always sort last. */
function sortTrips(
  trips: Trip[],
  qualifying: Map<number, TripDateRow[]>,
  sort: TripSort | undefined,
): Trip[] {
  const ranked = [...trips];
  if (sort === 'price_asc') {
    ranked.sort(
      (a, b) =>
        (minPriceOf(qualifying, a.id) ?? Number.POSITIVE_INFINITY) -
        (minPriceOf(qualifying, b.id) ?? Number.POSITIVE_INFINITY),
    );
  } else if (sort === 'price_desc') {
    ranked.sort(
      (a, b) =>
        (minPriceOf(qualifying, b.id) ?? Number.NEGATIVE_INFINITY) -
        (minPriceOf(qualifying, a.id) ?? Number.NEGATIVE_INFINITY),
    );
  } else if (sort === 'date_asc') {
    ranked.sort(
      (a, b) =>
        (earliestOf(qualifying, a.id) ?? Number.POSITIVE_INFINITY) -
        (earliestOf(qualifying, b.id) ?? Number.POSITIVE_INFINITY),
    );
  } else {
    ranked.sort((a, b) => a.id - b.id);
  }
  return ranked;
}

@Injectable()
export class TripsService {
  constructor(
    @Inject(BOOKING_SEATS_PROVIDER)
    private readonly bookedSeats: BookingSeatsProvider,
  ) {}

  async findAll(
    query: TripQueryDto,
  ): Promise<PaginatedTrips | PaginatedTripDetails> {
    // Sorted lists need per-trip date aggregates, so they go through the
    // search engine; plain lists keep the lean no-join path.
    if (query.sort !== undefined) {
      return this.searchTrips(query);
    }
    const page = query.page ?? DEFAULT_TRIPS_PAGE;
    const limit = query.limit ?? DEFAULT_TRIPS_LIMIT;
    const search = query.search?.trim() ? query.search.trim() : undefined;
    const destinationId = query.destinationId;
    const operatorId = query.operatorId ?? undefined;

    // Page + total run inside one transaction: a single round trip and a
    // consistent snapshot, so `total` always matches `data`. Both queries
    // share one filter builder, so they cannot diverge.
    const [data, total] = await db.transaction(async (tx) => {
      const buildBase = () => {
        let filtered = tx.orm.public.Trip.where((t) => t.isActive.eq(true));
        if (destinationId !== undefined) {
          filtered = filtered.where((t) => t.destinationId.eq(destinationId));
        }
        if (operatorId !== undefined) {
          filtered = filtered.where((t) => t.operatorId.eq(operatorId));
        }
        if (search !== undefined) {
          filtered = filtered.where((t) =>
            t.name.ilike(`%${escapeLikePattern(search)}%`),
          );
        }
        return filtered;
      };
      const rows = await buildBase()
        .orderBy((t) => t.id.asc())
        .limit(limit)
        .offset((page - 1) * limit)
        .all();

      const { total } = await buildBase().aggregate((a) => ({
        total: a.count(),
      }));

      return [rows, total] as const;
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async findByOperator(
    operatorId: number,
    query: TripQueryDto,
  ): Promise<PaginatedTrips> {
    return this.findAll({ ...query, operatorId });
  }

  /**
   * Powers GET /trips/search, GET /trips/filter and sorted GET /trips.
   * Date/price/availability criteria live on TripDate rows, so the engine
   * fetches candidate trips + their active dates in one transaction, then
   * filters, sorts and paginates in memory. Correct at catalog scale; if
   * trip volume ever makes the full candidate set heavy, push the sort keys
   * (min date price, earliest date) into the SQL-builder lane instead.
   */
  async searchTrips(
    criteria: TripSearchCriteria,
  ): Promise<PaginatedTripDetails> {
    const page = criteria.page ?? DEFAULT_TRIPS_PAGE;
    const limit = criteria.limit ?? DEFAULT_TRIPS_LIMIT;
    const text = criteria.text?.trim() ? criteria.text.trim() : undefined;
    const destinationId = criteria.destinationId;
    const minDuration = criteria.minDuration;
    const maxDuration = criteria.maxDuration;
    const dayBounds = criteria.date ? toDayBounds(criteria.date) : undefined;
    if (
      criteria.minPrice !== undefined &&
      criteria.maxPrice !== undefined &&
      criteria.minPrice > criteria.maxPrice
    ) {
      throw new BadRequestException('minPrice must not exceed maxPrice');
    }
    if (
      criteria.minDuration !== undefined &&
      criteria.maxDuration !== undefined &&
      criteria.minDuration > criteria.maxDuration
    ) {
      throw new BadRequestException('minDuration must not exceed maxDuration');
    }

    const { trips, datesByTrip } = await db.transaction(async (tx) => {
      let textDestinationIds: number[] = [];
      if (text !== undefined) {
        const pattern = `%${escapeLikePattern(text)}%`;
        const matches = await tx.orm.public.Destination.where((d) =>
          d.isActive.eq(true),
        )
          .where((d) =>
            or(
              d.name.ilike(pattern),
              d.city.ilike(pattern),
              d.country.ilike(pattern),
            ),
          )
          .select('id')
          .all();
        textDestinationIds = matches.map((d) => d.id);
      }

      let base = tx.orm.public.Trip.where((t) => t.isActive.eq(true));
      if (destinationId !== undefined) {
        base = base.where((t) => t.destinationId.eq(destinationId));
      }
      if (minDuration !== undefined) {
        base = base.where((t) => t.durationDays.gte(minDuration));
      }
      if (maxDuration !== undefined) {
        base = base.where((t) => t.durationDays.lte(maxDuration));
      }
      if (text !== undefined) {
        const pattern = `%${escapeLikePattern(text)}%`;
        base = base.where((t) =>
          textDestinationIds.length > 0
            ? or(
                t.name.ilike(pattern),
                t.description.ilike(pattern),
                t.destinationId.in(textDestinationIds),
              )
            : or(t.name.ilike(pattern), t.description.ilike(pattern)),
        );
      }
      const trips = await base.include('destination', (d) => d).all();

      const needsDates =
        dayBounds !== undefined ||
        criteria.minPrice !== undefined ||
        criteria.maxPrice !== undefined ||
        criteria.availableOnly === true ||
        criteria.sort !== undefined;
      let dateRows: TripDateRow[] = [];
      if (needsDates && trips.length > 0) {
        dateRows = await tx.orm.public.TripDate.where((d) =>
          d.tripId.in(trips.map((t) => t.id)),
        )
          .where((d) => d.isActive.eq(true))
          .all();
      }

      const datesByTrip = groupDatesByTrip(dateRows);
      return { trips, datesByTrip };
    });

    const qualifying = qualifyDatesByTrip(datesByTrip, {
      dayBounds,
      minPrice: criteria.minPrice,
      maxPrice: criteria.maxPrice,
    });

    const needsDateMatch =
      dayBounds !== undefined ||
      criteria.minPrice !== undefined ||
      criteria.maxPrice !== undefined ||
      criteria.availableOnly === true;
    let matching = needsDateMatch
      ? trips.filter((t) => (qualifying.get(t.id) ?? []).length > 0)
      : [...trips];

    if (criteria.availableOnly === true) {
      matching = await this.keepAvailableOnly(matching, qualifying);
    }

    const data = sortTrips(matching, qualifying, criteria.sort).slice(
      (page - 1) * limit,
      page * limit,
    );
    const total = matching.length;
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  /** Keep trips having at least one date with seats left. */
  private async keepAvailableOnly(
    trips: Trip[],
    qualifying: Map<number, TripDateRow[]>,
  ): Promise<Trip[]> {
    const visible: Trip[] = [];
    for (const trip of trips) {
      const rows = qualifying.get(trip.id) ?? [];
      for (const row of rows) {
        const booked = await this.bookedSeats.getConfirmedBookedSeats(row.id);
        if (row.capacity - booked > 0) {
          visible.push(trip);
          break;
        }
      }
    }
    return visible;
  }

  async findOne(tripId: number): Promise<Trip> {
    const trip = await db.orm.public.Trip.where((t) => t.isActive.eq(true))
      .where((t) => t.id.eq(tripId))
      .include('destination', (d) => d)
      .first();
    if (!trip) {
      throw new NotFoundException(`Trip with id ${tripId} not found`);
    }
    return trip;
  }

  async create(dto: CreateTripDto): Promise<Trip> {
    await this.assertActiveDestination(dto.destinationId);

    const created = await db.orm.public.Trip.create({
      destinationId: dto.destinationId,
      name: dto.name.trim(),
      ...(dto.description?.trim()
        ? { description: dto.description.trim() }
        : {}),
      durationDays: dto.durationDays,
      ...(dto.operatorId != null ? { operatorId: dto.operatorId } : {}),
    });
    return this.requireById(created.id);
  }

  async update(tripId: number, dto: UpdateTripDto): Promise<Trip> {
    await this.requireById(tripId);

    if (dto.destinationId !== undefined) {
      await this.assertActiveDestination(dto.destinationId);
    }

    const name = dto.name?.trim() ? dto.name.trim() : undefined;
    const description = dto.description?.trim()
      ? dto.description.trim()
      : undefined;
    const hasChanges =
      dto.destinationId !== undefined ||
      name !== undefined ||
      dto.description !== undefined ||
      dto.durationDays !== undefined ||
      dto.operatorId !== undefined ||
      dto.isActive !== undefined;
    if (!hasChanges) {
      return this.requireById(tripId);
    }

    await db.orm.public.Trip.where({ id: tripId }).update({
      ...(dto.destinationId !== undefined
        ? { destinationId: dto.destinationId }
        : {}),
      ...(name !== undefined ? { name } : {}),
      ...(dto.description !== undefined ? { description } : {}),
      ...(dto.durationDays !== undefined
        ? { durationDays: dto.durationDays }
        : {}),
      ...(dto.operatorId !== undefined ? { operatorId: dto.operatorId } : {}),
      ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
    });
    return this.requireById(tripId);
  }

  /**
   * Soft-delete: deactivates instead of hard-deleting so trip dates and
   * bookings that reference the trip never break. Idempotent. Blocked while
   * active dates exist — deactivate the dates first.
   */
  async remove(tripId: number): Promise<Trip> {
    const existing = await this.requireById(tripId);
    if (!existing.isActive) {
      return existing;
    }
    const liveDate = await db.orm.public.TripDate.where((d) =>
      d.tripId.eq(tripId),
    )
      .where((d) => d.isActive.eq(true))
      .first();
    if (liveDate) {
      throw new ConflictException(
        `Cannot deactivate trip with id ${tripId} while it has active dates`,
      );
    }
    await db.orm.public.Trip.where({ id: tripId }).update({
      isActive: false,
    });
    return this.requireById(tripId);
  }

  async getOperator(tripId: number): Promise<TripOperator> {
    const trip = await this.findOne(tripId);
    if (trip.operatorId === null) {
      throw new NotFoundException(
        `No operator assigned to trip with id ${tripId}`,
      );
    }
    return { operatorId: trip.operatorId };
  }

  /**
   * TODO(backend-1): validate that the operator exists once the Operator
   * module lands. Until then any positive int is accepted.
   */
  async assignOperator(tripId: number, dto: AssignOperatorDto): Promise<Trip> {
    await this.requireById(tripId);
    await db.orm.public.Trip.where({ id: tripId }).update({
      operatorId: dto.operatorId,
    });
    return this.requireById(tripId);
  }

  async unassignOperator(tripId: number): Promise<Trip> {
    const existing = await this.requireById(tripId);
    if (existing.operatorId === null) {
      return existing;
    }
    await db.orm.public.Trip.where({ id: tripId }).update({
      operatorId: null,
    });
    return this.requireById(tripId);
  }

  private async findById(tripId: number): Promise<Trip | null> {
    return db.orm.public.Trip.where((t) => t.id.eq(tripId))
      .include('destination', (d) => d)
      .first();
  }

  private async requireById(tripId: number): Promise<Trip> {
    const trip = await this.findById(tripId);
    if (!trip) {
      throw new NotFoundException(`Trip with id ${tripId} not found`);
    }
    return trip;
  }

  /**
   * Inactive destinations are invisible: trips can only point at destinations
   * that public GETs would return.
   */
  private async assertActiveDestination(destinationId: number): Promise<void> {
    const destination = await db.orm.public.Destination.first({
      id: destinationId,
    });
    if (!destination || !destination.isActive) {
      throw new NotFoundException(
        `Destination with id ${destinationId} not found`,
      );
    }
  }
}

/** UTC day bounds [start, end] in ms for a calendar-day match. */
function toDayBounds(date: string): DayBounds {
  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) {
    throw new BadRequestException('date must be a valid ISO-8601 calendar day');
  }
  const day = new Date(parsed);
  const start = Date.UTC(
    day.getUTCFullYear(),
    day.getUTCMonth(),
    day.getUTCDate(),
  );
  return { start, end: start + 86_400_000 - 1 };
}
