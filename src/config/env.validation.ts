import { z } from 'zod';

const envSchema = z.object({
  PORT: z.number({ coerce: true }),
  ENV: z.enum(['local', 'development', 'staging', 'production']),
  REDIS_HOST: z.string(),
  REDIS_PASS: z.string(),
  REDIS_PORT: z.number({ coerce: true }),
  SWAGGER_ENABLE: z.boolean({ coerce: true }).optional(),
  TYPEORM_HOST: z.string(),
  TYPEORM_PORT: z.number({ coerce: true }),
  TYPEORM_USERNAME: z.string(),
  TYPEORM_PASSWORD: z.string(),
  TYPEORM_DATABASE: z.string(),
  OFFER_PROVIDER_URL_OFFER1: z.string().url(),
  OFFER_PROVIDER_URL_OFFER2: z.string().url(),
});

export const envValidationSchema = {
  validate: (configuration: Record<string, unknown>) =>
    envSchema.parse(configuration),
};
