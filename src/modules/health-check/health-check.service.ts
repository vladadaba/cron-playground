import { Injectable } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { QueueHealthService } from './helpers/queue-health-service';

@Injectable()
export class HealthChecks {
  constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly health: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly queueHealthService: QueueHealthService,
  ) {}
  runHealthCheck() {
    return this.health.check([
      () =>
        this.typeOrmHealthIndicator.pingCheck('database', {
          connection: this.em.connection,
          timeout: 15000,
        }),
      ,
      () => this.queueHealthService.isQueueHealthy(),
    ]);
  }
}
