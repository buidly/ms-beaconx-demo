import { Resolver, Query, Args } from '@nestjs/graphql';
import { Example } from './entities/example';
import { ExampleArgs } from './entities/example.args';
import { ExampleService } from './services/example.service';

@Resolver(() => Example)
export class ExampleResolver {
  constructor(private readonly exampleService: ExampleService) {}

  @Query(() => [Example])
  async examples(@Args('input') input: ExampleArgs): Promise<Example[]> {
    return await this.exampleService.getExamples(
      { from: input.from, size: input.size },
      { search: input.search },
    );
  }
}
