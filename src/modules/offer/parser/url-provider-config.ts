import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderType } from '../interfaces/provider-type.enum';

@Injectable()
export class UrlProviderConfig {
  private readonly config: Record<ProviderType, string>;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      [ProviderType.Offer1]: this.configService.get(
        'OFFER_PROVIDER_URL_OFFER1',
      ),
      [ProviderType.Offer2]: this.configService.get(
        'OFFER_PROVIDER_URL_OFFER2',
      ),
    };
  }

  getUrl(provider: ProviderType) {
    return this.config[provider];
  }
}
