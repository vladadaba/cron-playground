# Starting locally

1. Have Docker installed on your machine
2. Run

```
docker-compose up
```

This will start mockserver, Redis, MariaDB, then it will run migrations and finally start our app.

Mockserver will generate between 1 and 10 valid, random offers each time request is made to `http://localhost:4000/offer1` or `http://localhost:4000/offer2`.

# URLs

- Swagger http://localhost:3000/docs - with offers endpoint for retreiving offers to see what is saved in the database
- Health checks http://localhost:3000/health - database and bull queue health is checked
- Job queue dashboard http://localhost:3000/queues

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

1. Use `bull` with Redis instead of `@nestjs/schedule` to support horizontal scaling of the app and have cron job per provider to make it more granular and faster. Per provider cron job is executed every X minutes where X is number of providers (every minute, job for different provider is executed) to load level writes to the database.
2. Use `zod` for parsing payloads
3. Use `slugify` to make human readable slugs (better SEO aswell if they would be used for URLs)
4. Dockerize the app and add `docker-compose.yml` to make everything easier to start locally
5. Implement requests using over-the-wire mocks (mockserver), so that same build artifact can be used in production instead of having forks in the code for different environments
6. Add structured logging using `pino`
7. Add health checks using `terminus`
8. Add offers REST API for displaying parsed offers
9. Add tests for parser to test different scenarios
