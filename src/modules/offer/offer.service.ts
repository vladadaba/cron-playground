import { Injectable, Logger } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name);

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}
}
