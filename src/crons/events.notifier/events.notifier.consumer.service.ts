import { Injectable } from '@nestjs/common';
import { CompetingRabbitConsumer, OriginLogger } from '@multiversx/sdk-nestjs';
import { NotifierBlockEvent } from './entities/notifier.block.event';
import { NotifierEvent } from './entities';
import Config from 'config/configuration';

@Injectable()
export class EventsNotifierConsumerService {
  private readonly logger: OriginLogger = new OriginLogger(EventsNotifierConsumerService.name);

  constructor() { }

  @CompetingRabbitConsumer({
    exchange: Config.features.eventsNotifier.exchange,
    queue: Config.features.eventsNotifier.queue,
  })
  async consumeEvents(blockEvent: NotifierBlockEvent) {
    try {
      for (const event of blockEvent.events) {
        await this.handleEvent(event);
      }
    } catch (error) {
      this.logger.error(
        `An unhandled error occurred when consuming events from block with hash ${blockEvent.hash}: ${JSON.stringify(
          blockEvent.events,
        )}`,
      );
      this.logger.error(error);

      throw error;
    }
  }

  private async handleEvent(event: NotifierEvent): Promise<void> {
    console.log(event);
  }
}
