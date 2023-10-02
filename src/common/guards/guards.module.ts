import { Module } from '@nestjs/common';
import { DynamicModuleUtils } from '../../utils/dynamic.module.utils';
import Config from '../../../config/configuration';
import { NativeAuthServer } from '@multiversx/sdk-native-auth-server';
import { ElrondCachingService } from '@multiversx/sdk-nestjs';

@Module({
  imports: [DynamicModuleUtils.getElrondCachingModule()],
  providers: [
    {
      provide: NativeAuthServer,
      useFactory: (cachingService: ElrondCachingService) => {
        return new NativeAuthServer({
          apiUrl: Config.urls.api,
          maxExpirySeconds: Config.security.nativeAuthTtl,
          acceptedOrigins: Config.security.nativeAuthAcceptedHosts,
          cache: {
            getValue: async function <T>(key: string): Promise<T | undefined> {
              if (key === 'block:timestamp:latest') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return new Date().getTime() / 1000;
              }

              return await cachingService.get<T>(key);
            },
            setValue: async function <T>(
              key: string,
              value: T,
              ttl: number,
            ): Promise<void> {
              await cachingService.set(key, value, ttl);
            },
          },
        });
      },
      inject: [ElrondCachingService],
    },
  ],
  exports: [NativeAuthServer],
})
export class GuardsModule {}
