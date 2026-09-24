import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { escapeLikePattern } from '../common/like-pattern.js';
import { db } from '../prisma/db.js';
import type { Models } from '../prisma/contract.d';
import type { AssignOperatorDto } from './dto/assign-operator.dto.js';
import type { CreateTripDto } from './dto/create-trip.dto.js';
import {
  DEFAULT_TRIPS_LIMIT,
  DEFAULT_TRIPS_PAGE,
  type TripQueryDto,
} from './dto/trip-query.dto.js';
import type { UpdateTripDto } from './dto/update-trip.dto.js';

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

export interface TripOperator {
  operatorId: number;
}

@Injectable()
export class TripsService {
  async findAll(query: TripQueryDto): Promise<PaginatedTrips> {
    const page = query.page ?? DEFAULT_TRIPS_PAGE;
    const limit = query.limit ?? DEFAULT_TRIPS_LIMIT;
    const search = query.search?.trim() ? query.search.trim() : undefined;
    const destinationId = query.destinationId;
    const operatorId = query.operatorId ?? undefined;

    // Page + total run inside one transaction: a single round trip and a
    // consistent snapshot, so `total` always matches `data`.
    const [data, total] = await db.transaction(async (tx) => {
      let list = tx.orm.public.Trip.where((t) => t.isActive.eq(true));
      if (destinationId !== undefined) {
        list = list.where((t) => t.destinationId.eq(destinationId));
      }
      if (operatorId !== undefined) {
        list = list.where((t) => t.operatorId.eq(operatorId));
      }
      if (search !== undefined) {
        list = list.where((t) =>
          t.name.ilike(`%${escapeLikePattern(search)}%`),
        );
      }
      const rows = await list
        .orderBy((t) => t.id.asc())
        .limit(limit)
        .offset((page - 1) * limit)
        .all();

      let counter = tx.orm.public.Trip.where((t) => t.isActive.eq(true));
      if (destinationId !== undefined) {
        counter = counter.where((t) => t.destinationId.eq(destinationId));
      }
      if (operatorId !== undefined) {
        counter = counter.where((t) => t.operatorId.eq(operatorId));
      }
      if (search !== undefined) {
        counter = counter.where((t) =>
          t.name.ilike(`%${escapeLikePattern(search)}%`),
        );
      }
      const { total } = await counter.aggregate((a) => ({
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
