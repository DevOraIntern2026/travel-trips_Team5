#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0b9a93ddbed6894c0b07d47becc242f90e853997677c580c73e60d02eb0b2572/contract';
import endContract from '../../snapshots/0b9a93ddbed6894c0b07d47becc242f90e853997677c580c73e60d02eb0b2572/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/7d4171360a71582d466bd4776224dc085fff2b9cf917b9ee4d7096bf3ef66909/contract';
import startContract from '../../snapshots/7d4171360a71582d466bd4776224dc085fff2b9cf917b9ee4d7096bf3ef66909/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'trip',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('destinationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('durationDays', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('operatorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'trip',
        index: 'trip_destinationId_idx_1646ee5c',
        columns: ['destinationId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'trip',
        foreignKey: {
          name: 'trip_destinationId_fkey',
          columns: ['destinationId'],
          references: { schema: 'public', table: 'destination', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
