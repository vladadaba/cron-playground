import slugify from 'slugify';
import { z } from 'zod';
import { IOffer } from '../interfaces/offer.interface';
import { ProviderType } from '../interfaces/provider-type.enum';

type IOfferWithoutProviderNameAndSlug = Omit<IOffer, 'providerName' | 'slug'>;

type SafeParseResponse = (
  response: unknown,
) => z.SafeParseReturnType<any, unknown>;

type GetOffersFromResponse = (data: any) => unknown[];

type SafeParseOffer = (
  offer: unknown,
) => z.SafeParseReturnType<any, IOfferWithoutProviderNameAndSlug>;

interface ParseStrategy {
  parseResponse: SafeParseResponse;
  getOffersFromResponse: GetOffersFromResponse;
  parseOffer: SafeParseOffer;
}

export interface ParsedOffers {
  offers: IOffer[];
  failed: {
    index: number;
    errors: { field: string; message: string }[];
  }[];
}

export class OfferPayloadParser {
  constructor(private readonly strategy: ParseStrategy) {}

  parse(response: any, provider: ProviderType): ParsedOffers {
    const parsedResponse = this.strategy.parseResponse(response);
    if ('error' in parsedResponse) {
      throw new Error(
        `Failed to parse response: ${parsedResponse.error.message}`,
      );
    }

    const parsedOffers = this.strategy
      .getOffersFromResponse(parsedResponse.data)
      .map((offer) => this.strategy.parseOffer(offer));

    const { parsed, failed } = this.partitionOffers(parsedOffers);

    return {
      offers: parsed.map((offer) => ({
        ...offer,
        slug: `${provider}-${offer.externalOfferId}-${slugify(offer.name)}`, // TODO: provider and externalOfferId are optional?
        providerName: provider,
      })),
      failed,
    };
  }

  private partitionOffers = (
    parsedOffers: z.SafeParseReturnType<
      any,
      IOfferWithoutProviderNameAndSlug
    >[],
  ) => {
    const parsed: IOfferWithoutProviderNameAndSlug[] = [];
    const failed: ParsedOffers['failed'] = [];
    for (let i = 0; i < parsedOffers.length; i++) {
      const offer = parsedOffers[i];
      if ('data' in offer) {
        parsed.push(offer.data);
      } else {
        failed.push({
          index: i,
          errors: offer.error.errors.map(({ path, message }) => ({
            field: path.join('.'),
            message,
          })),
        });
      }
    }

    return { parsed, failed };
  };
}
