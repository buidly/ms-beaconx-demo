import { Module } from '@nestjs/common';
import { DynamicModuleUtils } from 'src/utils/dynamic.module.utils';
import { EndpointsServicesModule } from './endpoints.services.module';
import { HealthCheckController } from './health-check/health.check.controller';

@Module({
  imports: [EndpointsServicesModule],
  providers: [DynamicModuleUtils.getNestJsApiConfigService()],
  controllers: [HealthCheckController],
})
export class EndpointsControllersModule {}
