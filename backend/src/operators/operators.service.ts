import { Injectable, NotFoundException } from '@nestjs/common';
import { escapeLikePattern } from '../common/like-pattern.js';
import { db } from '../prisma/db.js';
import type { Models } from '../prisma/contract.d';
import {
  DEFAULT_OPERATORS_LIMIT,
  DEFAULT_OPERATORS_PAGE,
  type OperatorQueryDto,
} from './dto/operator-query.dto.js';
import type { CreateOperatorDto } from './dto/create-operator.dto.js';
import type { UpdateOperatorDto } from './dto/update-operator.dto.js';
import type { OperatorStatusDto } from './dto/operator-status.dto.js';

export type Operator = Omit<Models.public_Operator, 'users'>;

export interface OperatorsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedOperators {
  data: Operator[];
  meta: OperatorsMeta;
}

@Injectable()
export class OperatorsService {
  async create(dto: CreateOperatorDto): Promise<Operator> {
    const description = dto.description?.trim()
      ? dto.description.trim()
      : undefined;
    return db.orm.public.Operator.create({
      name: dto.name.trim(),
      ...(description !== undefined ? { description } : {}),
    });
  }

  async findAll(
    query: OperatorQueryDto,
    activeOnly = true,
  ): Promise<PaginatedOperators> {
    const page = query.page ?? DEFAULT_OPERATORS_PAGE;
    const limit = query.limit ?? DEFAULT_OPERATORS_LIMIT;
    const search = query.search?.trim() ? query.search.trim() : undefined;

    const [data, total] = await db.transaction(async (tx) => {
      const buildBase = () => {
        let filtered = tx.orm.public.Operator;
        if (activeOnly) {
          filtered = filtered.where((o) => o.isActive.eq(true));
        }
        if (search !== undefined) {
          filtered = filtered.where((o) =>
            o.name.ilike(`%${escapeLikePattern(search)}%`),
          );
        }
        return filtered;
      };
      // tx.orm.public.Operator is a bare collection until filtered.
      const rows = await buildBase()
        .orderBy((o) => o.id.asc())
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

  async findOne(operatorId: number, activeOnly = true): Promise<Operator> {
    const operator = await db.orm.public.Operator.first({
      id: operatorId,
    });
    if (!operator || (activeOnly && !operator.isActive)) {
      throw new NotFoundException(`Operator with id ${operatorId} not found`);
    }
    return operator;
  }

  async update(operatorId: number, dto: UpdateOperatorDto): Promise<Operator> {
    const existing = await db.orm.public.Operator.first({ id: operatorId });
    if (!existing) {
      throw new NotFoundException(`Operator with id ${operatorId} not found`);
    }
    const name = dto.name?.trim() ? dto.name.trim() : undefined;
    const description = dto.description?.trim()
      ? dto.description.trim()
      : undefined;
    if (name === undefined && dto.description === undefined) {
      return existing;
    }
    const result = await db.orm.public.Operator.where({
      id: operatorId,
    }).update({
      ...(name !== undefined ? { name } : {}),
      ...(dto.description !== undefined ? { description } : {}),
    });
    const updated = Array.isArray(result) ? result[0] : result;
    return updated ?? existing;
  }

  async setStatus(
    operatorId: number,
    dto: OperatorStatusDto,
  ): Promise<Operator> {
    const existing = await db.orm.public.Operator.first({ id: operatorId });
    if (!existing) {
      throw new NotFoundException(`Operator with id ${operatorId} not found`);
    }
    if (existing.isActive === dto.isActive) {
      return existing;
    }
    const result = await db.orm.public.Operator.where({
      id: operatorId,
    }).update({ isActive: dto.isActive });
    const updated = Array.isArray(result) ? result[0] : result;
    return updated ?? { ...existing, isActive: dto.isActive };
  }
}
