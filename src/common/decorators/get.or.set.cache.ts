import { ElrondCachingService } from '@multiversx/sdk-nestjs';
import { Inject } from '@nestjs/common';
import { CacheInfo } from '../../utils/cache.info';

export function GetOrSetCache(cacheInfoFunc: (...args: any[]) => CacheInfo) {
  const injectCachingService = Inject(ElrondCachingService);

  return (
    target: any,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    injectCachingService(target, 'cachingService');

    const childMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const { key, ttl } = cacheInfoFunc(args);

      const cachingService: ElrondCachingService = (this as any).cachingService;

      const funcValue = () => childMethod.apply(this, args);
      return await cachingService.getOrSet(key, funcValue, ttl);
    };

    return descriptor;
  };
}
