import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProviderType } from './interfaces/provider-type.enum';
import { OfferService } from './offer.service';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get()
  @ApiOperation({ description: 'Get offers' })
  @ApiQuery({ name: 'provider', required: false, type: String })
  async getOffers(@Query('provider') providerName?: ProviderType) {
    const offers = await this.offerService.getOffers(providerName);

    return offers;
  }
}
