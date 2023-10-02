import { RabbitModule, RabbitModuleOptions } from '@multiversx/sdk-nestjs';
import { Module } from '@nestjs/common';
import Config from 'config/configuration';
import { EventsNotifierConsumerService } from './events.notifier.consumer.service';

@Module({
  imports: [
    RabbitModule.forRootAsync({
      useFactory: () => new RabbitModuleOptions(Config.features.eventsNotifier.url, []),
    }),
  ],
  providers: [
    EventsNotifierConsumerService,
  ],
})
export class EventsNotifierModule { }