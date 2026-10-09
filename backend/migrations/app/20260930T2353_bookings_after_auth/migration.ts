#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2e087fd5b3f85e30ad3c1d1d45efe41b64979d678781e2cea7b22d1535a12d32/contract';
import endContract from '../../snapshots/2e087fd5b3f85e30ad3c1d1d45efe41b64979d678781e2cea7b22d1535a12d32/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/9540be907599c4127e0827046b1b692b5e6b1c2b9e42ac8bf145157d638825b5/contract';
import startContract from '../../snapshots/9540be907599c4127e0827046b1b692b5e6b1c2b9e42ac8bf145157d638825b5/contract.json' with { type: 'json' };
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
        table: 'authToken',
        index: 'authToken_expiresAt_idx_6b6b8c10',
        columns: ['expiresAt'],
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
      this.createIndex({
        schema: 'public',
        table: 'refreshSession',
        index: 'refreshSession_expiresAt_idx_6b6b8c10',
        columns: ['expiresAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'trip',
        index: 'trip_operatorId_idx_a95ad064',
        columns: ['operatorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'tripDate',
        index: 'tripDate_startDate_endDate_idx_c734dcfc',
        columns: ['startDate', 'endDate'],
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
