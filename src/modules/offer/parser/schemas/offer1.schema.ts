import { z } from 'zod';

const responseSchema = z.object({
  response: z.object({
    offers: z.array(z.unknown()),
  }),
});

const getOffersFromResponse = (input: z.infer<typeof responseSchema>) =>
  input.response.offers;

const offerSchema = z
  .object({
    // should be mapped to `externalOfferId`
    offer_id: z.string().optional(),
    // should be mapped to `name`
    offer_name: z.string(),
    // should be mapped to `description`
    offer_desc: z.string(),
    // should be mapped to `requirements`
    call_to_action: z.string(),
    // should be mapped to offerUrlTemplate
    offer_url: z.string().url(),
    // should be mapped to `thumbnail`
    image_url: z.string().url(),
    // combine platform and device to map to `isDesktop`, `isAndroid`, `isIos`
    platform: z.enum(['mobile', 'desktop']), // possible values are "desktop" | "mobile"
    device: z.string(), // 'iphone_ipad' is iOS, anything else should be considered as android
  })
  .transform(
    ({
      offer_id,
      offer_name,
      offer_desc,
      call_to_action,
      offer_url,
      image_url,
      platform,
      device,
    }) => {
      const isDesktop = platform === 'desktop' ? 1 : 0;
      const isIos = device === 'iphone_ipad' ? 1 : 0;

      return {
        name: offer_name,
        description: offer_desc,
        requirements: call_to_action,
        thumbnail: image_url,
        isDesktop,
        isIos,
        isAndroid: !isDesktop && !isIos ? 1 : 0,
        offerUrlTemplate: offer_url,
        externalOfferId: offer_id,
      };
    },
  );

export const schema = {
  parseResponse: responseSchema.safeParse,
  getOffersFromResponse,
  parseOffer: offerSchema.safeParse,
};
