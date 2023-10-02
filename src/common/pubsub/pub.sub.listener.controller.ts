import { ElrondCachingService } from '@multiversx/sdk-nestjs';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class PubSubListenerController {
  private logger: Logger;

  constructor(private readonly cachingService: ElrondCachingService) {
    this.logger = new Logger(PubSubListenerController.name);
  }

  @EventPattern('deleteCacheKeys')
  async deleteCacheKey(keys: string[]) {
    for (const key of keys) {
      this.logger.log(`Deleting local cache key ${key}`);
      await this.cachingService.delete(key);
    }
  }
}
