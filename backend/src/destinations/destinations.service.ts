import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';
import type { Models } from '../prisma/contract.d';
import { escapeLikePattern } from '../common/like-pattern.js';
import {
  DEFAULT_DESTINATIONS_LIMIT,
  DEFAULT_DESTINATIONS_PAGE,
  type DestinationQueryDto,
} from './dto/destination-query.dto.js';
import type { CreateDestinationDto } from './dto/create-destination.dto.js';
import type { UpdateDestinationDto } from './dto/update-destination.dto.js';

// Omit 'trips': the back-relation is only populated via .include(), which
// no destination query uses.
export type Destination = Omit<Models.public_Destination, 'trips'>;

export interface DestinationsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedDestinations {
  data: Destination[];
  meta: DestinationsMeta;
}

/**
 * Detect a unique-constraint violation whether it surfaces raw from the
 * driver (SqlQueryError with Postgres SQLSTATE 23505) or wrapped by the ORM.
 * Boundary validation: every property access is type-narrowed before use.
 */
function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const record = error as Record<string, unknown>;
  if (record['sqlState'] === '23505' || record['code'] === '23505') {
    return true;
  }
  return (
    typeof record['message'] === 'string' &&
    (/unique constraint/i.test(record['message']) ||
      /duplicate key value/i.test(record['message']))
  );
}

@Injectable()
export class DestinationsService {
  async findAll(query: DestinationQueryDto): Promise<PaginatedDestinations> {
    const page = query.page ?? DEFAULT_DESTINATIONS_PAGE;
    const limit = query.limit ?? DEFAULT_DESTINATIONS_LIMIT;
    const search = query.search?.trim() ? query.search.trim() : undefined;

    // Page + total run inside one transaction: a single round trip and a
    // consistent snapshot, so `total` always matches `data`. Both queries
    // share one filter builder, so they cannot diverge.
    const [data, total] = await db.transaction(async (tx) => {
      const buildBase = () => {
        let filtered = tx.orm.public.Destination.where((d) =>
          d.isActive.eq(true),
        );
        if (search !== undefined) {
          filtered = filtered.where((d) =>
            d.name.ilike(`%${escapeLikePattern(search)}%`),
          );
        }
        return filtered;
      };
      const rows = await buildBase()
        .orderBy((d) => d.id.asc())
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

  async findOne(destinationId: number): Promise<Destination> {
    const destination = await db.orm.public.Destination.where((d) =>
      d.isActive.eq(true),
    )
      .where((d) => d.id.eq(destinationId))
      .first();
    if (!destination) {
      throw new NotFoundException(
        `Destination with id ${destinationId} not found`,
      );
    }
    return destination;
  }

  async create(dto: CreateDestinationDto): Promise<Destination> {
    const name = dto.name.trim();
    const city = dto.city.trim();
    const country = dto.country.trim();
    const description = dto.description?.trim()
      ? dto.description.trim()
      : undefined;

    await this.assertNameAvailable(name);

    try {
      return await db.orm.public.Destination.create({
        name,
        city,
        country,
        ...(description !== undefined ? { description } : {}),
      });
    } catch (error) {
      // Race backstop: a concurrent insert may win between the pre-check and
      // the insert despite the application-level check above.
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          `Destination name "${name}" is already in use`,
        );
      }
      throw error;
    }
  }

  async update(
    destinationId: number,
    dto: UpdateDestinationDto,
  ): Promise<Destination> {
    const existing = await db.orm.public.Destination.first({
      id: destinationId,
    });
    if (!existing) {
      throw new NotFoundException(
        `Destination with id ${destinationId} not found`,
      );
    }

    const name = dto.name?.trim() ? dto.name.trim() : undefined;
    if (name !== undefined) {
      await this.assertNameAvailable(name, destinationId);
    }
    const description = dto.description?.trim()
      ? dto.description.trim()
      : undefined;
    const city = dto.city?.trim() ? dto.city.trim() : undefined;
    const country = dto.country?.trim() ? dto.country.trim() : undefined;

    const hasChanges =
      name !== undefined ||
      dto.description !== undefined ||
      city !== undefined ||
      country !== undefined ||
      dto.isActive !== undefined;
    if (!hasChanges) {
      return existing;
    }

    if (dto.isActive === false && existing.isActive) {
      await this.assertNoActiveTrips(destinationId);
    }

    const result = await db.orm.public.Destination.where({
      id: destinationId,
    }).update({
      ...(name !== undefined ? { name } : {}),
      ...(dto.description !== undefined ? { description } : {}),
      ...(city !== undefined ? { city } : {}),
      ...(country !== undefined ? { country } : {}),
      ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
    });
    const updated = Array.isArray(result) ? result[0] : result;
    return updated ?? existing;
  }

  /**
   * Soft-delete: deactivates instead of hard-deleting so trips/bookings that
   * reference the destination never break. Idempotent. Blocked with 409
   * while active trips reference this destination — deactivate the trips
   * first (same rule as PUT with isActive: false).
   */
  async remove(destinationId: number): Promise<Destination> {
    const existing = await db.orm.public.Destination.first({
      id: destinationId,
    });
    if (!existing) {
      throw new NotFoundException(
        `Destination with id ${destinationId} not found`,
      );
    }
    if (!existing.isActive) {
      return existing;
    }
    await this.assertNoActiveTrips(destinationId);
    const result = await db.orm.public.Destination.where({
      id: destinationId,
    }).update({ isActive: false });
    const updated = Array.isArray(result) ? result[0] : result;
    return updated ?? { ...existing, isActive: false };
  }

  private async assertNoActiveTrips(destinationId: number): Promise<void> {
    const liveTrip = await db.orm.public.Trip.where((t) =>
      t.destinationId.eq(destinationId),
    )
      .where((t) => t.isActive.eq(true))
      .first();
    if (liveTrip) {
      throw new ConflictException(
        `Cannot deactivate destination with id ${destinationId} while it has active trips`,
      );
    }
  }

  /**
   * Names are globally unique (case-insensitive), including inactive records:
   * the DB `@unique` constraint cannot see case, so the application enforces
   * it. Reusing a deactivated name requires reactivating that record via PUT.
   */
  private async assertNameAvailable(
    name: string,
    excludeId?: number,
  ): Promise<void> {
    let candidates = db.orm.public.Destination.where((d) =>
      d.name.ilike(escapeLikePattern(name)),
    );
    if (excludeId !== undefined) {
      candidates = candidates.where((d) => d.id.neq(excludeId));
    }
    const existing = await candidates.first();
    if (existing) {
      throw new ConflictException(
        `Destination name "${name}" is already in use`,
      );
    }
  }
}
