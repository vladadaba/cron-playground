# Starting locally

1. Have Docker installed on your machine
2. Run

```
docker-compose up
```

This will start mockserver, Redis, MariaDB, then it will run migrations and finally start our app.

Mockserver will generate between 1 and 10 valid, random offers each time request is made to `http://localhost:4000/offer1` or `http://localhost:4000/offer2`.

# URLs

- Swagger `/docs`
- Health checks `/health`
- Job queue dashboard `/queues`

# Migrations

Create empty migration file:

```
yarn migration:create src/migrations/<name>
```

Generate migrations based on entities:

```
yarn build && yarn migration:generate src/migrations/<name>
```

Run migrations based on entities:

```
yarn build && yarn migration:run
```

# Decision log

1. Use MySQL/MariaDB instead of Postgres (provided `offer.entity.ts` uses `tinyint` type which is not available on Postgres). `offer.entity.ts` will be used as provided without modifications.
2. Use `bull` with Redis instead of `@nestjs/schedule` to support horizontal scaling of the app and have cron job per provider to make it more granular and faster
3. Use `zod` for parsing payloads.
4. Use `slugify` to make human readable slugs (better SEO aswell if they would be used for URLs).
5. Dockerize the app and add `docker-compose.yml` to make everything easier to start locally.
6. Implement requests using over-the-wire mocks (mockserver), so that same build artifact can be used in production instead of having forks in the code for different environments.
7. Add structured logging using `pino`
8. Add health checks using `terminus`
9. Add offers REST API for displaying parsed offers. Add ability to filter by provider.
