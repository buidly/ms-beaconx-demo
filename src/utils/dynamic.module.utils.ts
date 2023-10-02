import {
  ApiModule,
  ApiModuleOptions,
  ERDNEST_CONFIG_SERVICE,
  ElrondCachingModule,
  RedisCacheModuleOptions,
  ElasticModule,
  ElasticModuleOptions,
} from '@multiversx/sdk-nestjs';
import { DynamicModule, Provider } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import Config from 'config/configuration';
import { ErdnestConfigServiceImpl } from 'src/common/api-config/erdnest.config.service.impl';

export class DynamicModuleUtils {
  static getElasticModule(): DynamicModule {
    return ElasticModule.forRootAsync({
      imports: [],
      useFactory: () =>
        new ElasticModuleOptions({
          url: Config.urls.elastic,
          customValuePrefix: 'api',
        }),
      inject: [],
    });
  }

  static getElrondCachingModule(): DynamicModule {
    return ElrondCachingModule.forRootAsync({
      imports: [],
      useFactory: () =>
        new RedisCacheModuleOptions({
          host: Config.urls.redis,
        }),
      inject: [],
    });
  }

  static getApiModule(): DynamicModule {
    return ApiModule.forRootAsync({
      imports: [],
      useFactory: () =>
        new ApiModuleOptions({
          axiosTimeout: Config.axiosTimeout,
          rateLimiterSecret: Config.security.rateLimiterSecret,
          serverTimeout: Config.serverTimeout,
          useKeepAliveAgent: Config.keepAlive.enabled,
        }),
      inject: [],
    });
  }

  static getNestJsApiConfigService(): Provider {
    return {
      provide: ERDNEST_CONFIG_SERVICE,
      useClass: ErdnestConfigServiceImpl,
    };
  }

  static getPubSubService(): Provider {
    return {
      provide: 'PUBSUB_SERVICE',
      useFactory: () => {
        const clientOptions: ClientOptions = {
          transport: Transport.REDIS,
          options: {
            host: Config.urls.redis,
            port: 6379,
            retryDelay: 1000,
            retryAttempts: 10,
            retryStrategy: () => 1000,
          },
        };

        return ClientProxyFactory.create(clientOptions);
      },
      inject: [],
    };
  }
}
