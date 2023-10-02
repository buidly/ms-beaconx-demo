import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {
  LoggerInitializer,
} from '@multiversx/sdk-nestjs';
import Config from 'config/configuration';
import { EventsNotifierModule } from './events.notifier/events.notifier.module';

async function bootstrap() {
  const eventsNotifierApp = await NestFactory.create(EventsNotifierModule);
  await eventsNotifierApp.listen(Config.eventsNotifier.port);

  const logger = new Logger('Bootstrapper');

  LoggerInitializer.initialize(logger);

  logger.log('Events notifier active started');
}

bootstrap();
