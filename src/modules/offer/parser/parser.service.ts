import { Injectable } from '@nestjs/common';
import { ProviderType } from '../interfaces/provider-type.enum';
import { OfferPayloadParser } from './offer-payload-parser';
import offer1 from './schemas/offer1.schema';
import offer2 from './schemas/offer2.schema';

type ParserProviderConfig = Record<ProviderType, OfferPayloadParser>;

@Injectable()
export class ParserService {
  private readonly offerProviderConfig: ParserProviderConfig;

  constructor() {
    this.offerProviderConfig = {
      [ProviderType.Offer1]: new OfferPayloadParser(
        ProviderType.Offer1,
        offer1.parseResponse,
        offer1.getOffersFromResponse,
        offer1.parseOffer,
      ),
      [ProviderType.Offer2]: new OfferPayloadParser(
        ProviderType.Offer2,
        offer2.parseResponse,
        offer2.getOffersFromResponse,
        offer2.parseOffer,
      ),
    };
  }

  parseOffers = (provider: ProviderType, payload: unknown) => {
    return this.offerProviderConfig[provider].parse(payload);
  };
}
