import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DynamicModuleUtils } from 'src/utils/dynamic.module.utils';
import { TransactionProcessorService } from './transaction.processor.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DynamicModuleUtils.getElrondCachingModule(),
  ],
  providers: [TransactionProcessorService],
})
export class TransactionProcessorModule {}
