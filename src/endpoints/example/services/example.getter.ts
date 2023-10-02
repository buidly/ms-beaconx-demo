import { Injectable } from '@nestjs/common';
import { GetOrSetCache } from 'src/common/decorators/get.or.set.cache';
import { CacheInfo } from 'src/utils/cache.info';
import { ExampleAbiService } from './example.abi';

@Injectable()
export class ExampleGetterService {
  constructor(private readonly abiService: ExampleAbiService) {}

  @GetOrSetCache(CacheInfo.Example)
  async getExampleData(): Promise<any> {
    return this.abiService.getExampleData();
  }
}
