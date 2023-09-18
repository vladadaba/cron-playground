import { Controller, Get } from '@nestjs/common';
import { HealthChecks } from './health-check.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health Check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthChecks) {}

  @Get()
  check() {
    return this.healthCheckService.runHealthCheck();
  }
}
