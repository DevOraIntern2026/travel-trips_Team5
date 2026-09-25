#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2037be9593bed13917efc96f637ae0e08502a9d11e4881ff5f4a32bca9558fdb/contract';
import startContract from '../../snapshots/2037be9593bed13917efc96f637ae0e08502a9d11e4881ff5f4a32bca9558fdb/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9540be907599c4127e0827046b1b692b5e6b1c2b9e42ac8bf145157d638825b5/contract';
import endContract from '../../snapshots/9540be907599c4127e0827046b1b692b5e6b1c2b9e42ac8bf145157d638825b5/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'authToken',
        columns: [
          col('consumedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('purpose', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'authToken_purpose_check_a09ab07e',
            "\"purpose\" IN ('verify-email', 'reset-password')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'operator',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'refreshSession',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('revokedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('emailVerifiedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('isActive', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('operatorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('role', 'text', {
          notNull: true,
          default: lit('customer'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'authToken',
        constraint: 'authToken_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'refreshSession',
        constraint: 'refreshSession_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'user',
        constraint: 'user_role_check_8b9dd8ee',
        expression: "\"role\" IN ('admin', 'operator', 'customer')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'authToken',
        index: 'authToken_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'refreshSession',
        index: 'refreshSession_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'user',
        index: 'user_operatorId_idx_a95ad064',
        columns: ['operatorId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'authToken',
        foreignKey: {
          name: 'authToken_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'refreshSession',
        foreignKey: {
          name: 'refreshSession_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'user',
        foreignKey: {
          name: 'user_operatorId_fkey',
          columns: ['operatorId'],
          references: { schema: 'public', table: 'operator', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
