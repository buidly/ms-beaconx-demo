import { Injectable } from '@nestjs/common';
import { OriginLogger } from '@multiversx/sdk-nestjs';
import { NotifierBlockEvent } from './entities/notifier.block.event';
import { NotifierEvent } from './entities';
import Config from 'config/configuration';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class EventsNotifierConsumerService {
  private readonly logger: OriginLogger = new OriginLogger(EventsNotifierConsumerService.name);

  constructor() { }

  @RabbitSubscribe({
    queue: Config.eventsNotifier.queue,
    createQueueIfNotExists: false,
  })
  async consumeEvents(blockEvent: NotifierBlockEvent) {
    try {
      this.logger.log(`Received ${blockEvent.events.length} events from block with hash ${blockEvent.hash}`);
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
