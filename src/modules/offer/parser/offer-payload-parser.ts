import slugify from 'slugify';
import { z } from 'zod';
import { IOffer } from '../interfaces/offer.interface';
import { ProviderType } from '../interfaces/provider-type.enum';

type SafeParseResponse = (
  response: unknown,
) => z.SafeParseReturnType<any, unknown>;

type GetOffersFromResponse = (data: any) => unknown[];

type IOfferWithoutProviderNameAndSlug = Omit<IOffer, 'providerName' | 'slug'>;

type SafeParseOffer = (
  offer: unknown,
) => z.SafeParseReturnType<any, IOfferWithoutProviderNameAndSlug>;

export interface ParsedOffers {
  offers: IOffer[];
  failed: {
    index: number;
    error: string;
  }[];
}

export class OfferPayloadParser {
  constructor(
    private readonly providerType: ProviderType,
    private readonly safeParseResponse: SafeParseResponse,
    private readonly getOffersFromResponse: GetOffersFromResponse,
    private readonly safeParseOffer: SafeParseOffer,
  ) {}

  parse(response: any): ParsedOffers {
    const parsedResponse = this.safeParseResponse(response);
    if ('error' in parsedResponse) {
      throw new Error(
        `Failed to parse response: ${parsedResponse.error.message}`,
      );
    }

    const parsedOffers = this.getOffersFromResponse(parsedResponse.data).map(
      (offer) => this.safeParseOffer(offer),
    );

    const { parsed, failed } = this.partitionOffers(parsedOffers);

    return {
      offers: parsed.map((offer) => ({
        ...offer,
        slug: `${this.providerType}-${slugify(offer.name)}`,
        providerName: this.providerType,
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
        failed.push({ index: i, error: offer.error.message });
      }
    }

    return { parsed, failed };
  };
}
