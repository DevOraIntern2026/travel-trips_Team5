import {
  Controller,
  Get,
  HttpCode,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator.js';
import { HealthService } from './health.service.js';

@ApiTags('health')
// Probes poll every few seconds, usually from one IP: exempt entirely.
// (Auth) endpoints stay throttled; only health is exempt.
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Service availability with dependency details' })
  @ApiResponse({ status: 200, description: 'Service is available.' })
  @ApiResponse({ status: 503, description: 'A dependency is down.' })
  async health() {
    const report = await this.healthService.readiness();
    if (report.status !== 'ok') {
      throw new ServiceUnavailableException({
        status: report.status,
        service: 'backend',
        checks: { database: report.database },
        timestamp: report.timestamp,
      });
    }
    return {
      status: report.status,
      service: 'backend',
      checks: { database: report.database },
      timestamp: report.timestamp,
    };
  }

  @Get('ready')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Readiness: can this instance serve traffic?' })
  @ApiResponse({ status: 200, description: 'Ready.' })
  @ApiResponse({ status: 503, description: 'Not ready (database down).' })
  async ready() {
    const report = await this.healthService.readiness();
    if (report.status !== 'ok') {
      throw new ServiceUnavailableException({ status: report.status });
    }
    return { status: report.status };
  }

  @Get('live')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Liveness: is the process running?' })
  @ApiResponse({ status: 200, description: 'Alive. No dependency checks.' })
  live() {
    return { status: 'ok', uptime: Math.floor(process.uptime()) };
  }
}
