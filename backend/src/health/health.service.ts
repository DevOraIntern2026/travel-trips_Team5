import { Injectable } from '@nestjs/common';
import { db } from '../prisma/db.js';

export type DependencyStatus = 'up' | 'down';

export interface ReadinessReport {
  status: 'ok' | 'error';
  database: DependencyStatus;
  timestamp: string;
}

/**
 * Readiness probes. Liveness (the process is running) needs no check and
 * lives in the controller; everything here is about dependencies.
 */
@Injectable()
export class HealthService {
  async checkDatabase(): Promise<DependencyStatus> {
    try {
      await db.orm.public.User.aggregate((a) => ({ total: a.count() }));
      return 'up';
    } catch {
      return 'down';
    }
  }

  async readiness(): Promise<ReadinessReport> {
    const database = await this.checkDatabase();
    return {
      status: database === 'up' ? 'ok' : 'error',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
