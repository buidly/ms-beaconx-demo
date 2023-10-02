import { Injectable } from '@nestjs/common';
import { QueryPagination } from 'src/common/entities/query.paginations';
import { Example } from '../entities/example';
import { ExampleFilter } from '../entities/example.filter';
import { ExampleGetterService } from './example.getter';

@Injectable()
export class ExampleService {
  constructor(private readonly getterService: ExampleGetterService) {}

  async getExamples(
    pagination: QueryPagination,
    filter: ExampleFilter,
  ): Promise<Example[]> {
    let examples = await this.getterService.getExampleData();

    if (filter.search) {
      const search = filter.search.toLowerCase();

      examples = examples.filter((x: Example) =>
        x.description.toLowerCase().includes(search),
      );
    }

    return examples.slice(pagination.from, pagination.from + pagination.size);
  }
}
