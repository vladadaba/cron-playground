import { Injectable, Logger } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProviderType } from './interfaces/provider-type.enum';

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name);

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  getOffers(providerName?: ProviderType) {
    const where = providerName ? { providerName } : undefined;

    return this.offerRepository.find({ where });
  }
}
