import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { escapeLikePattern } from '../common/like-pattern.js';
import { or } from '@prisma/orm-postgres/orm-client';
import { db } from '../prisma/db.js';
import { toSafeUser, type SafeUser } from '../auth/auth.service.js';
import type { AuthenticatedUser } from '../auth/authenticated-user.js';
import {
  DEFAULT_USERS_LIMIT,
  DEFAULT_USERS_PAGE,
  type UserQueryDto,
} from './dto/user-query.dto.js';
import type { UpdateProfileDto } from './dto/update-profile.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { UserStatusDto } from './dto/user-status.dto.js';

export interface PaginatedUsers {
  data: SafeUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable()
export class UsersService {
  async getProfile(userId: number): Promise<SafeUser> {
    const user = await db.orm.public.User.first({ id: userId });
    if (!user || !user.isActive) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return toSafeUser(user);
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<SafeUser> {
    const name = dto.name?.trim() ? dto.name.trim() : undefined;
    const username = dto.username?.trim() ? dto.username.trim() : undefined;
    if (name !== undefined || username !== undefined) {
      await db.orm.public.User.where({ id: userId }).update({
        ...(name !== undefined ? { name } : {}),
        ...(username !== undefined ? { username } : {}),
      });
    }
    return this.getProfile(userId);
  }

  async findAll(query: UserQueryDto): Promise<PaginatedUsers> {
    const page = query.page ?? DEFAULT_USERS_PAGE;
    const limit = query.limit ?? DEFAULT_USERS_LIMIT;
    const search = query.search?.trim() ? query.search.trim() : undefined;

    // Management view: includes inactive accounts.
    const [rows, total] = await db.transaction(async (tx) => {
      const buildBase = () => {
        let filtered = tx.orm.public.User;
        if (search !== undefined) {
          const pattern = `%${escapeLikePattern(search)}%`;
          filtered = filtered.where((u) =>
            or(
              u.name.ilike(pattern),
              u.username.ilike(pattern),
              u.email.ilike(pattern),
            ),
          );
        }
        return filtered;
      };
      const data = await buildBase()
        .orderBy((u) => u.id.asc())
        .limit(limit)
        .offset((page - 1) * limit)
        .all();
      const { total } = await buildBase().aggregate((a) => ({
        total: a.count(),
      }));
      return [data, total] as const;
    });

    return {
      data: rows.map(toSafeUser),
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: number): Promise<SafeUser> {
    const user = await db.orm.public.User.first({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return toSafeUser(user);
  }

  async updateUser(
    targetId: number,
    dto: UpdateUserDto,
    requester: AuthenticatedUser,
  ): Promise<SafeUser> {
    const existing = await db.orm.public.User.first({ id: targetId });
    if (!existing) {
      throw new NotFoundException(`User with id ${targetId} not found`);
    }
    if (
      targetId === requester.id &&
      dto.role &&
      dto.role !== toSafeUser(existing).role
    ) {
      throw new ForbiddenException('Admins cannot change their own role');
    }

    const name = dto.name?.trim() ? dto.name.trim() : undefined;
    const username = dto.username?.trim() ? dto.username.trim() : undefined;
    const role = dto.role;
    let operatorId: number | null | undefined;
    if (dto.operatorId !== undefined) {
      operatorId = dto.operatorId;
      if (operatorId !== null) {
        await this.assertActiveOperator(operatorId);
      }
    }
    const resultingRole = role ?? toSafeUser(existing).role;
    if (
      resultingRole !== 'Operator' &&
      operatorId !== undefined &&
      operatorId !== null
    ) {
      throw new BadRequestException('operatorId requires role Operator');
    }
    if (resultingRole === 'Operator' && operatorId === undefined) {
      // Keep existing linkage; nothing to validate.
    }

    // Map app-vocabulary roles to stored lowercase values.
    const dbRole =
      role === undefined
        ? undefined
        : (role.toLowerCase() as 'admin' | 'operator' | 'customer');

    await db.orm.public.User.where({ id: targetId }).update({
      ...(name !== undefined ? { name } : {}),
      ...(username !== undefined ? { username } : {}),
      ...(dbRole !== undefined ? { role: dbRole } : {}),
      ...(operatorId !== undefined ? { operatorId } : {}),
    });
    const updated = await db.orm.public.User.first({ id: targetId });
    if (!updated) {
      throw new NotFoundException(`User with id ${targetId} not found`);
    }
    return toSafeUser(updated);
  }

  async setStatus(
    targetId: number,
    dto: UserStatusDto,
    requester: AuthenticatedUser,
  ): Promise<SafeUser> {
    const existing = await db.orm.public.User.first({ id: targetId });
    if (!existing) {
      throw new NotFoundException(`User with id ${targetId} not found`);
    }
    if (targetId === requester.id) {
      throw new ForbiddenException('Admins cannot change their own status');
    }
    await db.orm.public.User.where({ id: targetId }).update({
      isActive: dto.isActive,
    });
    const updated = await db.orm.public.User.first({ id: targetId });
    if (!updated) {
      throw new NotFoundException(`User with id ${targetId} not found`);
    }
    return toSafeUser(updated);
  }

  private async assertActiveOperator(operatorId: number): Promise<void> {
    const operator = await db.orm.public.Operator.first({ id: operatorId });
    if (!operator || !operator.isActive) {
      throw new NotFoundException(`Operator with id ${operatorId} not found`);
    }
  }
}
