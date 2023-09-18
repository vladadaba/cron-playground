import { HttpModule } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Offer } from './entities/offer.entity';
import { OfferService } from './offer.service';
import { ParserService } from './parser/parser.service';
import { ProviderType } from './interfaces/provider-type.enum';
import { JobProcessor, OffersJob } from './job.processor';
import { UrlProviderConfig } from './parser/url-provider-config';
import { OFFERS_JOB_OFFERS_JOB_QUEUE_NAME } from '../../config/constants';
import { OfferController } from './offer.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: OFFERS_JOB_OFFERS_JOB_QUEUE_NAME,
    }),
    BullBoardModule.forFeature({
      name: OFFERS_JOB_OFFERS_JOB_QUEUE_NAME,
      adapter: BullAdapter,
    }),
    TypeOrmModule.forFeature([Offer]),
    HttpModule,
  ],
  controllers: [OfferController],
  providers: [OfferService, ParserService, JobProcessor, UrlProviderConfig],
})
export class OfferModule implements OnModuleInit {
  constructor(
    @InjectQueue(OFFERS_JOB_OFFERS_JOB_QUEUE_NAME)
    private readonly jobQueue: Queue<OffersJob>,
  ) {}

  async onModuleInit() {
    const repeatableJobs = await this.jobQueue.getRepeatableJobs();

    for (const job of repeatableJobs) {
      await this.jobQueue.removeRepeatableByKey(job.key);
    }

    const providers = Object.values(ProviderType);
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      await this.jobQueue.add(
        {
          provider,
        },
        {
          repeat: {
            // run every minute, but cycle through providers
            // each provider is updated every X minutes where X is number of providers
            cron: `${i + 1}/${providers.length} * * * *`,
          },
          removeOnComplete: 5,
        },
      );
    }
  }
}
