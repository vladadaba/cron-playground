import { ProviderType } from '../src/modules/offer/interfaces/provider-type.enum';
import { ParserService } from '../src/modules/offer/parser/parser.service';
import validSingleOffer1 from './payloads/offer1_valid_single.json';
import validMultipleOffer1 from './payloads/offer1_valid_multiple.payload.json';
import invalidOffer1 from './payloads/offer1_invalid.payload.json';
import validSingleOffer2 from './payloads/offer2_valid_single.payload.json';
import validMultipleOffer2 from './payloads/offer2_valid_multiple.payload.json';
import invalidOffer2 from './payloads/offer2_invalid.payload.json';
import mixedMultipleOffer1 from './payloads/offer1_mixed_multiple.payload.json';
import mixedMultipleOffer2 from './payloads/offer2_mixed_multiple.payload.json';

describe('ParserService tests', () => {
  const parserService = new ParserService();

  describe('offer1 provider tests', () => {
    describe('valid payload with a single offer', () => {
      const { offers, failed } = parserService.parseOffers(
        ProviderType.Offer1,
        validSingleOffer1,
      );

      it('offer is successfully parsed', () => {
        expect(offers).toHaveLength(1);
        expect(failed).toHaveLength(0);
      });

      it('all fields are parsed correctly', () => {
        const offer = offers[0];
        expect(offer.description).toBe(
          'Play and reach level 23 within 14 days.',
        );
        expect(offer.externalOfferId).toBe('1111');
        expect(offer.isAndroid).toBe(0);
        expect(offer.isDesktop).toBe(0);
        expect(offer.isIos).toBe(1);
        expect(offer.name).toBe('MyGym - iOS');
        expect(offer.offerUrlTemplate).toBe('https://some.url');
        expect(offer.providerName).toBe('offer1');
        expect(offer.requirements).toBe(
          'Play and reach level 23 within 14 days.',
        );
        expect(offer.slug).toBe('offer1-MyGym-iOS');
        expect(offer.thumbnail).toBe('https://some.url');
      });
    });

    describe('valid payload with multiple offers', () => {
      const { offers, failed } = parserService.parseOffers(
        ProviderType.Offer1,
        validMultipleOffer1,
      );

      it('all offers in payload are successfully parsed', () => {
        expect(offers).toHaveLength(3);
        expect(failed).toHaveLength(0);
      });

      it('ids are parsed correctly', () => {
        expect(offers[0].externalOfferId).toBe('1111');
        expect(offers[1].externalOfferId).toBe('2222');
        expect(offers[2].externalOfferId).toBe('3333');
      });

      it('isDesktop, isAndroid and isIos are parsed correctly', () => {
        expect(offers[0].isDesktop).toBeFalsy();
        expect(offers[0].isAndroid).toBeFalsy();
        expect(offers[0].isIos).toBeTruthy();
        expect(offers[1].isDesktop).toBeFalsy();
        expect(offers[1].isAndroid).toBeTruthy();
        expect(offers[1].isIos).toBeFalsy();
        expect(offers[2].isDesktop).toBeTruthy();
        expect(offers[2].isAndroid).toBeFalsy();
        expect(offers[2].isIos).toBeFalsy();
      });
    });

    describe('invalid payload', () => {
      const { offers, failed } = parserService.parseOffers(
        ProviderType.Offer1,
        invalidOffer1,
      );

      it('all offers in payload failed parsing', () => {
        expect(offers).toHaveLength(0);
        expect(failed).toHaveLength(3);
      });

      it('offers[0] has error about missing offer_name', () => {
        const offer = failed.find((x) => x.index === 0);
        expect(offer.errors).toHaveLength(1);
        expect(offer.errors[0].field).toBe('offer_name');
        expect(offer.errors[0].message).toBe('Required');
      });

      it('offers[1] has error about missing offer_desc and offer_url is not an url', () => {
        const offer = failed.find((x) => x.index === 1);
        expect(offer.errors).toHaveLength(2);
        expect(offer.errors[0].field).toBe('offer_desc');
        expect(offer.errors[0].message).toBe('Required');
        expect(offer.errors[1].field).toBe('offer_url');
        expect(offer.errors[1].message).toBe('Invalid url');
      });

      it('offers[2] has error about invalid platform value', () => {
        const offer = failed.find((x) => x.index === 2);
        expect(offer.errors).toHaveLength(1);
        expect(offer.errors[0].field).toBe('platform');
        expect(offer.errors[0].message).toBe(
          `Invalid enum value. Expected 'mobile' | 'desktop', received 'unknown'`,
        );
      });
    });

    describe('mixed payload', () => {
      const { offers, failed } = parserService.parseOffers(
        ProviderType.Offer1,
        mixedMultipleOffer1,
      );

      it('1 successful and 1 failed', () => {
        expect(offers).toHaveLength(1);
        expect(failed).toHaveLength(1);
      });
    });
  });

  describe('offer2 provider tests', () => {
    describe('valid payload with a single offer', () => {
      const { offers, failed } = parserService.parseOffers(
        ProviderType.Offer2,
        validSingleOffer2,
      );

      it('offer is successfully parsed', () => {
        expect(offers).toHaveLength(1);
        expect(failed).toHaveLength(0);
      });

      it('all fields are parsed correctly', () => {
        const offer = offers[0];
        expect(offer.description).toBe(
          'SoFi is a one-stop shop for your finances, designed to help you Get Your Money Right.',
        );
        expect(offer.externalOfferId).toBe('15828');
        expect(offer.isAndroid).toBe(0);
        expect(offer.isDesktop).toBe(1);
        expect(offer.isIos).toBe(1);
        expect(offer.name).toBe('Sofi');
        expect(offer.offerUrlTemplate).toBe('https://some.url');
        expect(offer.providerName).toBe('offer2');
        expect(offer.requirements).toBe(
          'Register with VALID personal information, Make a minimum deposit of $50,Redeem your points! *New Users Only!',
        );
        expect(offer.slug).toBe('offer2-Sofi');
        expect(offer.thumbnail).toBe('https://some.url');
      });
    });

    describe('valid payload with multiple offers', () => {
      const { offers, failed } = parserService.parseOffers(
        ProviderType.Offer2,
        validMultipleOffer2,
      );

      it('all offers in payload are successfully parsed', () => {
        expect(offers).toHaveLength(2);
        expect(failed).toHaveLength(0);
      });

      it('ids are parsed correctly', () => {
        expect(offers[0].externalOfferId).toBe('1111');
        expect(offers[1].externalOfferId).toBe('2222');
      });
    });

    describe('invalid payload', () => {
      const { offers, failed } = parserService.parseOffers(
        ProviderType.Offer2,
        invalidOffer2,
      );

      it('all offers in payload failed parsing', () => {
        expect(offers).toHaveLength(0);
        expect(failed).toHaveLength(2);
      });

      it('offers[0] has error about missing offer_name', () => {
        const offer = failed.find((x) => x.index === 0);
        expect(offer.errors).toHaveLength(1);
        expect(offer.errors[0].field).toBe('Offer.name');
        expect(offer.errors[0].message).toBe('Required');
      });

      it('offers[1] has error about missing offer_desc and offer_url is not an url', () => {
        const offer = failed.find((x) => x.index === 1);
        expect(offer.errors).toHaveLength(2);
        expect(offer.errors[0].field).toBe('Offer.tracking_url');
        expect(offer.errors[0].message).toBe('Invalid url');
        expect(offer.errors[1].field).toBe('Offer.description');
        expect(offer.errors[1].message).toBe('Required');
      });
    });

    describe('mixed payload', () => {
      const { offers, failed } = parserService.parseOffers(
        ProviderType.Offer2,
        mixedMultipleOffer2,
      );

      it('1 successful and 1 failed', () => {
        expect(offers).toHaveLength(1);
        expect(failed).toHaveLength(1);
      });
    });
  });
});
