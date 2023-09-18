import { Processor, Process } from '@nestjs/bull';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
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
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
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

      let progress = 0;
      await this.log(`Saving offers to database`, job, {
        offersCount: offers.length,
      });
      for (const offer of offers) {
        try {
          // save one by one in case one of the parsed offers is not satisfying unique constraint (e.g. job being processed twice)
          await this.offerRepository.save(offer);
        } catch (err) {
          // some constraint failed
          await this.log(
            'Saving offer to database failed',
            job,
            { offer },
            err,
          );
        } finally {
          progress++;
          await job.progress(progress / offers.length);
        }
      }
    } catch (err) {
      this.logger.error(
        { err, jobName: job.name, data: job.data },
        'Job processing failed.',
      );
      throw new Error(err.message, { cause: err });
    }
  }

  async log(
    message: string,
    job: Job<OffersJob>,
    data: unknown,
    error?: Error,
  ) {
    if (error) {
      this.logger.error({ error, data }, message);
    } else {
      this.logger.log({ data }, message);
    }

    await job.log(`${message}. ${JSON.stringify(data)}`);
  }
}
