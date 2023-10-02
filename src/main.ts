import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { join } from 'path';
import { PrivateAppModule } from './private.app.module';
import { PublicAppModule } from './public.app.module';
import * as bodyParser from 'body-parser';
import { Logger, NestInterceptor } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { CacheWarmerModule } from './crons/cache.warmer/cache.warmer.module';
import { TransactionProcessorModule } from './crons/transaction.processor/transaction.processor.module';
import {
  MetricsService,
  LoggingInterceptor,
  CachingService,
  CachingInterceptor,
  LoggerInitializer,
} from '@multiversx/sdk-nestjs';
import Config from 'config/configuration';
import { EventsNotifierModule } from './crons/events.notifier/events.notifier.module';

async function bootstrap() {
  const publicApp = await NestFactory.create(PublicAppModule);
  publicApp.use(bodyParser.json({ limit: '1mb' }));
  publicApp.enableCors();
  publicApp.useLogger(publicApp.get(WINSTON_MODULE_NEST_PROVIDER));
  publicApp.use(cookieParser());

  const metricsService = publicApp.get<MetricsService>(MetricsService);
  const httpAdapterHostService = publicApp.get<HttpAdapterHost>(HttpAdapterHost);

  const httpServer = httpAdapterHostService.httpAdapter.getHttpServer();
  httpServer.keepAliveTimeout = Config.serverTimeout;
  httpServer.headersTimeout = Config.serverTimeout + 1000; //`keepAliveTimeout + server's expected response time`

  const globalInterceptors: NestInterceptor[] = [];
  globalInterceptors.push(new LoggingInterceptor(metricsService));

  if (Config.useCachingInterceptor) {
    const cachingService = publicApp.get<CachingService>(CachingService);

    const cachingInterceptor = new CachingInterceptor(
      cachingService,
      httpAdapterHostService,
      metricsService,
    );

    globalInterceptors.push(cachingInterceptor);
  }

  publicApp.useGlobalInterceptors(...globalInterceptors);

  const description = readFileSync(join(__dirname, '..', 'docs', 'swagger.md'), 'utf8');

  const documentBuilder = new DocumentBuilder()
    .setTitle('Buidly Microservice API')
    .setDescription(description)
    .setVersion('1.0.0')
    .setExternalDoc('MultiversX Docs', 'https://docs.multiversx.com');

  const config = documentBuilder.build();

  const document = SwaggerModule.createDocument(publicApp, config);
  SwaggerModule.setup('', publicApp, document);

  if (Config.features.publicApi.isActive) {
    await publicApp.listen(Config.features.publicApi.port);
  }

  if (Config.features.privateApi.isActive) {
    const privateApp = await NestFactory.create(PrivateAppModule);
    await privateApp.listen(Config.features.privateApi.port);
  }

  if (Config.features.cacheWarmer.isActive) {
    const cacheWarmerApp = await NestFactory.create(CacheWarmerModule);
    await cacheWarmerApp.listen(Config.features.cacheWarmer.port);
  }

  if (Config.features.transactionProcessor.isActive) {
    const transactionProcessorApp = await NestFactory.create(TransactionProcessorModule);
    await transactionProcessorApp.listen(Config.features.transactionProcessor.port);
  }

  if (Config.features.eventsNotifier.isActive) {
    const eventsNotifierApp = await NestFactory.create(EventsNotifierModule);
    await eventsNotifierApp.listen(Config.features.eventsNotifier.port);
  }

  const logger = new Logger('Bootstrapper');

  LoggerInitializer.initialize(logger);

  logger.log(`Public API active: ${Config.features.publicApi.isActive}`);
  logger.log(`Private API active: ${Config.features.privateApi.isActive}`);
  logger.log(`Transaction processor active: ${Config.features.transactionProcessor.isActive}`);
  logger.log(`Cache warmer active: ${Config.features.cacheWarmer.isActive}`);
  logger.log(`Events notifier active: ${Config.features.eventsNotifier.isActive}`);
}

bootstrap();
