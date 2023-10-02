
import { TransactionProcessor } from '@multiversx/sdk-transaction-processor';
import { Constants, ElrondCachingService, Locker } from '@multiversx/sdk-nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import Config from 'config/configuration';

@Injectable()
export class TransactionProcessorService {
  private transactionProcessor: TransactionProcessor = new TransactionProcessor();
  private readonly logger: Logger;

  constructor(
    private readonly cachingService: ElrondCachingService
  ) {
    this.logger = new Logger(TransactionProcessorService.name);
  }

  @Cron('*/1 * * * * *')
  async handleNewTransactions() {
    Locker.lock('newTransactions', async () => {
      await this.transactionProcessor.start({
        gatewayUrl: Config.urls.api,
        maxLookBehind: Config.features.transactionProcessor.maxLookBehind,
        onTransactionsReceived: async (shardId, nonce, transactions, statistics) => {
          this.logger.log(`Received ${transactions.length} transactions on shard ${shardId} and nonce ${nonce}. Time left: ${statistics.secondsLeft}`);
        },
        getLastProcessedNonce: async (shardId) => {
          return await this.cachingService.get(`lastProcessedNonce:${shardId}`);
        },
        setLastProcessedNonce: async (shardId, nonce) => {
          await this.cachingService.set(`lastProcessedNonce:${shardId}`, nonce, Constants.oneMonth());
        },
      });
    });
  }
}
