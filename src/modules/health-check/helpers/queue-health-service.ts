import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OFFERS_JOB_OFFERS_JOB_QUEUE_NAME } from '../../../config/constants';

@Injectable()
export class QueueHealthService extends HealthIndicator {
  constructor(
    @InjectQueue(OFFERS_JOB_OFFERS_JOB_QUEUE_NAME) protected queue: Queue,
  ) {
    super();
  }

  public async isQueueHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = !!(await this.queue.isReady());
    const data = {
      currentStatus: this.queue.client.status,
      totalJobs: await this.queue.count().catch(() => null),
    };

    const result = this.getStatus(
      `redis-queue:${OFFERS_JOB_OFFERS_JOB_QUEUE_NAME}`,
      !!(await this.queue.isReady()),
      data,
    );

    if (!isHealthy) {
      throw new HealthCheckError(
        `Queue ${OFFERS_JOB_OFFERS_JOB_QUEUE_NAME} is not connected`,
        result,
      );
    }

    return result;
  }
}
