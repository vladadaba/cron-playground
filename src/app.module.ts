import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { OfferModule } from './modules/offer/offer.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('TYPEORM_HOST'),
        port: configService.get<number>('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get('REDIS_PASS'),
        },
      }),
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          autoLogging: false,
          transport:
            configService.get('ENV') === 'local'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                  },
                }
              : undefined,
        },
      }),
    }),
    HealthCheckModule,
    OfferModule,
  ],
})
export class AppModule {}
