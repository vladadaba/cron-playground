import { Processor, Process } from '@nestjs/bull';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
import { EntityManager } from 'typeorm';
import { ProviderType } from './interfaces/provider-type.enum';
import { Offer } from './entities/offer.entity';
import { ParserService } from './parser/parser.service';
import { UrlProviderConfig } from './parser/url-provider-config';
import { OFFERS_JOB_OFFERS_JOB_QUEUE_NAME } from '../../config/constants';

export interface OffersJob {
  provider: ProviderType;
}

@Processor(OFFERS_JOB_OFFERS_JOB_QUEUE_NAME)
export class JobProcessor {
  private readonly logger = new Logger(JobProcessor.name);

  constructor(
    @InjectEntityManager() private readonly em: EntityManager,
    private readonly httpService: HttpService,
    private readonly parserService: ParserService,
    private readonly urlConfig: UrlProviderConfig,
  ) {}

  @Process()
  async handleJob(job: Job<OffersJob>) {
    try {
      const provider = job.data.provider;
      this.logger.log(
        { jobName: job.name, data: job.data },
        'Received job to process...',
      );
      const { data } = await firstValueFrom(
        this.httpService.get(this.urlConfig.getUrl(provider)),
      );

      const { offers, failed } = this.parserService.parseOffers(provider, data);

      if (failed.length > 0) {
        await this.log('Some offers failed to parse', job, { failed });
      }

      await this.log(`Saving offers to database`, job, {
        offersCount: offers.length,
      });

      await this.em.connection
        .createQueryBuilder()
        .insert()
        .into(Offer)
        .values(offers)
        .orIgnore() // bulk insert, but ignore any that fail constraints (e.g. unique slug)
        .execute(); // would be better to have reporting for failed ones, but saving one by one seems like an overkill
    } catch (err) {
      this.logger.error(
        { err, jobName: job.name, data: job.data },
        'Job processing failed.',
      );
      throw new Error(err.message, { cause: err });
    }
  }

  async log(message: string, job: Job<OffersJob>, data: unknown) {
    this.logger.log({ data }, message);
    await job.log(`${message}. ${JSON.stringify(data)}`);
  }
}
