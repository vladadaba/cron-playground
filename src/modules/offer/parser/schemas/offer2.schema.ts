import { z } from 'zod';

const responseSchema = z.object({
  data: z.record(z.string(), z.unknown()),
});

const getOffersFromResponse = (input: z.infer<typeof responseSchema>) =>
  Object.values(input.data);

const offerSchema = z
  .object({
    Offer: z.object({
      // should be mapped to `externalOfferId`
      campaign_id: z.number().optional(),
      // should be mapped to `thumbnail`
      icon: z.string().url(),
      // should be mapped to `name`
      name: z.string(),
      // should be mapped to `offerUrlTemplate`
      tracking_url: z.string().url(),
      // should be mapped to `requirements`
      instructions: z.string(),
      // should be mapped to `description`
      description: z.string(),
    }),
    OS: z.object({
      // this should be mapped to `isAndroid`
      android: z.boolean(),
      // this should be mapped to `isIos`
      ios: z.boolean(),
      // this should be mapped to `isDesktop`
      web: z.boolean(),
    }),
  })
  .transform(
    ({
      Offer: {
        campaign_id,
        description,
        icon,
        instructions,
        name,
        tracking_url,
      },
      OS: { android, ios, web },
    }) => ({
      name,
      description,
      requirements: instructions,
      thumbnail: icon,
      isDesktop: web ? 1 : 0,
      isIos: ios ? 1 : 0,
      isAndroid: android ? 1 : 0,
      offerUrlTemplate: tracking_url,
      externalOfferId:
        campaign_id !== undefined ? campaign_id.toString() : undefined,
    }),
  );

export const schema = {
  parseResponse: responseSchema.safeParse,
  getOffersFromResponse,
  parseOffer: offerSchema.safeParse,
};
