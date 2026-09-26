#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2037be9593bed13917efc96f637ae0e08502a9d11e4881ff5f4a32bca9558fdb/contract';
import startContract from '../../snapshots/2037be9593bed13917efc96f637ae0e08502a9d11e4881ff5f4a32bca9558fdb/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/79771679c9bd5ca8977df6d5e9f0db68a3c7c1dcfbe9a1886dd69dd156ab6c58/contract';
import endContract from '../../snapshots/79771679c9bd5ca8977df6d5e9f0db68a3c7c1dcfbe9a1886dd69dd156ab6c58/contract.json' with { type: 'json' };
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
        table: 'booking',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('customerId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('price', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('Confirmed'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('tripDateId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tripId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'booking_status_check_0200d7e3',
            "\"status\" IN ('Confirmed', 'Cancelled')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'trip',
        column: col('cancellationWindowHours', 'int4', {
          notNull: true,
          default: lit(24),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'tripDate',
        column: col('bookedSeats', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'tripDate',
        constraint: 'tripdate_capacity_check_3ee2feb7',
        expression: '"capacity" >= "bookedSeats"',
      }),
      this.createIndex({
        schema: 'public',
        table: 'booking',
        index: 'booking_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'booking',
        index: 'booking_tripDateId_idx_a5fef724',
        columns: ['tripDateId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'booking',
        index: 'booking_tripId_idx_75da6d97',
        columns: ['tripId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'booking',
        foreignKey: {
          name: 'booking_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'booking',
        foreignKey: {
          name: 'booking_tripId_fkey',
          columns: ['tripId'],
          references: { schema: 'public', table: 'trip', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'booking',
        foreignKey: {
          name: 'booking_tripDateId_fkey',
          columns: ['tripDateId'],
          references: { schema: 'public', table: 'tripDate', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
