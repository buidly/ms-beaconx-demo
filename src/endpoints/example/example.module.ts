import { ResultsParser } from '@multiversx/sdk-core/out';
import { ContractLoader } from '@multiversx/sdk-nestjs';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { Module } from '@nestjs/common';
import Config from 'config/configuration';
import { DynamicModuleUtils } from 'src/utils/dynamic.module.utils';
import { ProviderKeys } from 'src/utils/provider.enum';
import { ExampleResolver } from './example.resolver';
import { ExampleAbiService } from './services/example.abi';
import { ExampleGetterService } from './services/example.getter';
import { ExampleService } from './services/example.service';
import { ExampleSetterService } from './services/example.setter';

@Module({
  imports: [DynamicModuleUtils.getElrondCachingModule()],
  providers: [
    ExampleResolver,
    ExampleService,
    ExampleGetterService,
    ExampleSetterService,
    ExampleAbiService,
    {
      provide: ProviderKeys.SWAP_CONTRACT,
      useFactory: async () => {
        const contractLoader = new ContractLoader(
          'src/common/abis/example.abi.json',
          'Example',
        );

        return await contractLoader.getContract(Config.contracts.swapContract);
      },
    },
    {
      provide: ProxyNetworkProvider,
      useValue: new ProxyNetworkProvider(Config.urls.gateway),
    },
    {
      provide: ResultsParser,
      useValue: new ResultsParser(),
    },
  ],
  exports: [ExampleService, ExampleAbiService],
})
export class ExampleModule {}
