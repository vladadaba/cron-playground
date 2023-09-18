import { ProviderType } from './provider-type.enum';

export interface IOffer {
  name: string;
  slug: string;
  description: string;
  requirements: string;
  thumbnail: string;
  isDesktop: number;
  isAndroid: number;
  isIos: number;
  offerUrlTemplate: string;
  providerName: ProviderType;
  externalOfferId?: string;
}
