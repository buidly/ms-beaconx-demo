import {
  Interaction,
  IPlainTransactionObject,
  ResultsParser,
  SmartContract,
} from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { Inject, Injectable } from '@nestjs/common';
import Config from 'config/configuration';
import { GasInfo } from 'src/utils/gas.info';
import { ProviderKeys } from 'src/utils/provider.enum';
import { Example } from '../entities/example';

@Injectable()
export class ExampleAbiService {
  constructor(
    @Inject(ProviderKeys.SWAP_CONTRACT)
    private readonly contract: SmartContract,
    private readonly proxy: ProxyNetworkProvider,
    private readonly resultsParser: ResultsParser,
  ) {}

  public async getExampleData(): Promise<Example> {
    const interaction: Interaction = this.contract.methods.getExampleData([]);
    const query = interaction.check().buildQuery();
    const response = await this.proxy.queryContract(query);
    const { firstValue } = this.resultsParser.parseQueryResponse(
      response,
      interaction.getEndpoint(),
    );

    return (
      firstValue
        ?.valueOf()
        ?.map(
          (value: any) =>
            new Example({ id: value.id, description: value.description }),
        ) ?? [new Example({ id: '1', description: 'Test' })]
    );
  }

  public setExampleData(): IPlainTransactionObject {
    const interaction = this.contract.methods
      .updateTier()
      .withGasLimit(GasInfo.SwapTokens.value)
      .withChainID(Config.chainId);

    return interaction.buildTransaction().toPlainObject();
  }
}
