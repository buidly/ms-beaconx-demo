import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import {
  Locker,
  Constants,
  ElrondCachingService,
} from '@multiversx/sdk-nestjs';
import { ExampleAbiService } from 'src/endpoints/example/services/example.abi';

@Injectable()
export class CacheWarmerService {
  constructor(
    private readonly cachingService: ElrondCachingService,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
    private readonly exampleAbi: ExampleAbiService,
  ) {}

  @Cron('* * * * *')
  async handleExampleInvalidations() {
    await Locker.lock(
      'Example invalidations',
      async () => {
        const examples = await this.exampleAbi.getExampleData();
        await this.invalidateKey('examples', examples, Constants.oneHour());
      },
      true,
    );
  }

  private async invalidateKey<T>(key: string, data: T, ttl: number) {
    await Promise.all([
      this.cachingService.set(key, data, ttl),
      this.deleteCacheKey(key),
    ]);
  }

  private async deleteCacheKey(key: string) {
    await this.clientProxy.emit('deleteCacheKeys', [key]);
  }
}
