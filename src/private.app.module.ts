import { Module } from '@nestjs/common';
import { HealthCheckController } from './endpoints/health-check/health.check.controller';
import { CacheController } from './endpoints/caching/cache.controller';
import { ApiMetricsController } from './common/metrics/api.metrics.controller';
import { DynamicModuleUtils } from './utils/dynamic.module.utils';
import { ApiMetricsModule } from './common/metrics/api.metrics.module';
import { LoggingModule } from '@multiversx/sdk-nestjs';

@Module({
  imports: [
    ApiMetricsModule,
    DynamicModuleUtils.getElrondCachingModule(),
    LoggingModule,
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
    DynamicModuleUtils.getPubSubService(),
  ],
  controllers: [
    ApiMetricsController,
    CacheController,
    HealthCheckController,
  ],
})
export class PrivateAppModule { }
