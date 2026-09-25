#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/0b9a93ddbed6894c0b07d47becc242f90e853997677c580c73e60d02eb0b2572/contract';
import startContract from '../../snapshots/0b9a93ddbed6894c0b07d47becc242f90e853997677c580c73e60d02eb0b2572/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/2037be9593bed13917efc96f637ae0e08502a9d11e4881ff5f4a32bca9558fdb/contract';
import endContract from '../../snapshots/2037be9593bed13917efc96f637ae0e08502a9d11e4881ff5f4a32bca9558fdb/contract.json' with { type: 'json' };
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
        table: 'tripDate',
        columns: [
          col('capacity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('endDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('price', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
          col('startDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('tripId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('tripdate_capacity_positive_2e07dccc', 'capacity > 0'),
          checkExpression('tripdate_end_after_start_cd17f3f0', '"endDate" >= "startDate"'),
          checkExpression('tripdate_price_non_negative_faabb23d', 'price >= 0'),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tripDate',
        index: 'tripDate_tripId_idx_75da6d97',
        columns: ['tripId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'tripDate',
        foreignKey: {
          name: 'tripDate_tripId_fkey',
          columns: ['tripId'],
          references: { schema: 'public', table: 'trip', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
