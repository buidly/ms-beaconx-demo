import { ElrondCachingService } from '@multiversx/sdk-nestjs';
import { Injectable } from '@nestjs/common';
import { CacheInfo } from 'src/utils/cache.info';

@Injectable()
export class ExampleSetterService {
  constructor(protected readonly cachingService: ElrondCachingService) {}

  async setTokenMetadata(value: any): Promise<void> {
    return await this.cachingService.set(
      CacheInfo.Example().key,
      value,
      CacheInfo.Example().ttl,
    );
  }
}
