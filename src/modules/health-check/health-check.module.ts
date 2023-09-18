import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { HealthCheckController } from './health-check.controller';
import { HealthChecks } from './health-check.service';
import { QueueHealthService } from './helpers/queue-health-service';
import { OFFERS_JOB_OFFERS_JOB_QUEUE_NAME } from '../../config/constants';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    BullModule.registerQueue({
      name: OFFERS_JOB_OFFERS_JOB_QUEUE_NAME,
    }),
  ],
  controllers: [HealthCheckController],
  providers: [HealthChecks, QueueHealthService],
})
export class HealthCheckModule {}
