import { Injectable } from '@nestjs/common';
import { ProviderType } from '../interfaces/provider-type.enum';
import { OfferPayloadParser } from './offer-payload-parser';
import { offer1, offer2 } from './schemas';

type ParserProviderConfig = Record<ProviderType, OfferPayloadParser>;

@Injectable()
export class ParserService {
  private readonly offerProviderConfig: ParserProviderConfig;

  constructor() {
    this.offerProviderConfig = {
      [ProviderType.Offer1]: new OfferPayloadParser(offer1),
      [ProviderType.Offer2]: new OfferPayloadParser(offer2),
    };
  }

  parseOffers = (provider: ProviderType, payload: unknown) => {
    return this.offerProviderConfig[provider].parse(payload, provider);
  };
}
