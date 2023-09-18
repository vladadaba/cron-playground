import { mockServerClient } from 'mockserver-client';
import { loremIpsum } from 'lorem-ipsum';
import fetch from 'node-fetch';

const randomText = (numberOfWords: number) =>
  loremIpsum({ count: numberOfWords, units: 'word' });

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomOffer1 = () => {
  const platform = ['mobile', 'desktop'][randomNumber(0, 1)];
  const device =
    platform === 'mobile'
      ? ['iphone_ipad', 'android'][randomNumber(0, 1)]
      : 'pc';
  return {
    offer_id: randomNumber(1000000, 9999999).toString(),
    offer_name: randomText(2),
    offer_desc: randomText(8),
    call_to_action: randomText(8),
    disclaimer: randomText(12),
    offer_url: 'https://some.url',
    offer_url_easy: 'https://some.url',
    payout: 10.675,
    payout_type: 'cpe',
    amount: 8873,
    image_url: 'https://some.url',
    image_url_220x124: 'https://some.url',
    countries: ['NZ'],
    platform,
    device,
    category: {
      '9': 'Mobile Apps',
    },
    last_modified: 1645095666,
    preview_url: 'https://some.url',
    package_id: 'idnumbers',
    verticals: [
      {
        vertical_id: '4',
        vertical_name: 'Lifestyle',
      },
      {
        vertical_id: '11',
        vertical_name: 'Health',
      },
    ],
  };
};

const callbackOffer1 = () => ({
  statusCode: 200,
  body: {
    query: {
      pubid: '1',
      appid: 1,
      country: '',
      platform: 'all',
    },
    response: {
      currency_name: 'Coins',
      offers_count: 2729,
      offers: Array.from({ length: Math.floor(Math.random() * 10 + 1) }).map(
        () => randomOffer1(),
      ),
    },
  },
});

const randomOffer2 = () => {
  const offer_id = randomNumber(10000, 99999);
  return {
    [offer_id]: {
      Offer: {
        campaign_id: offer_id,
        store_id: null,
        tracking_type: 'CPA',
        campaign_vertical: 'professional_finance',
        currency_name_singular: 'coin',
        currency_name_plural: 'coins',
        network_epc: '4.8359',
        icon: 'https://some.url',
        name: randomText(2),
        tracking_url: 'https://some.url',
        instructions: randomText(15),
        disclaimer: null,
        description: randomText(15),
        short_description: 'Make a Deposit to Earn!',
        offer_sticker_text_1: 'RECOMMENDED',
        offer_sticker_text_2: null,
        offer_sticker_text_3: null,
        offer_sticker_color_1: 'D100BC',
        offer_sticker_color_2: 'FFFFFF',
        offer_sticker_color_3: 'FFFFFF',
        sort_order_setting: null,
        category_1: 'free',
        category_2: null,
        amount: 53550,
        payout_usd: 69.25,
        start_datetime: '2022-04-19 11:58:30',
        end_datetime: '2042-04-19 04:59:00',
        is_multi_reward: false,
      },
      Country: {
        include: {
          US: {
            id: 243,
            code: 'US',
            name: 'United States',
          },
        },
        exclude: [],
      },
      State: {
        include: [],
        exclude: [],
      },
      City: {
        include: [],
        exclude: [],
      },
      Connection_Type: {
        cellular: true,
        wifi: true,
      },
      Device: {
        include: [],
        exclude: [],
      },
      OS: {
        android: Boolean(randomNumber(0, 1)),
        ios: Boolean(randomNumber(0, 1)),
        web: Boolean(randomNumber(0, 1)),
        min_ios: null,
        max_ios: null,
        min_android: null,
        max_android: null,
      },
    },
  };
};

const callbackOffer2 = () => ({
  statusCode: 200,
  body: {
    status: 'success',
    data: Object.assign(
      {},
      ...Array.from({ length: Math.floor(Math.random() * 10 + 1) }).map(() =>
        randomOffer2(),
      ),
    ),
  },
});

(async () => {
  while (true) {
    try {
      await fetch(
        `http://${process.env.MOCKSERVER_HOST}:${process.env.MOCKSERVER_PORT}`,
      );
      break;
    } catch {
      console.log('Waiting for mockserver to accept connections...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  const client = mockServerClient(
    process.env.MOCKSERVER_HOST,
    +process.env.MOCKSERVER_PORT,
  );

  try {
    await client.mockWithCallback(
      {
        path: '/offer1',
      },
      callbackOffer1,
      {
        unlimited: true,
      },
    );

    console.log('offer2 expectation created');
  } catch (error) {
    console.log('offer2 error: ', error);
  }

  try {
    await client.mockWithCallback(
      {
        path: '/offer2',
      },
      callbackOffer2,
      {
        unlimited: true,
      },
    );

    console.log('offer2 expectation created');
  } catch (error) {
    console.log('offer2 error: ', error);
  }
})();
