import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTokenArgs } from './entities/token.args';
import { Token } from './schemas/token.schema';
import { TokenService } from './token.service';

@Resolver(() => Token)
export class TokensResolver {
  constructor(private readonly tokenService: TokenService) {}

  @Mutation(() => Token)
  async createToken(@Args('input') input: CreateTokenArgs): Promise<Token> {
    return await this.tokenService.create({
      identifier: input.identifier,
      name: input.name,
    });
  }

  @Query(() => [Token], { name: 'tokens' })
  async findAll(): Promise<Token[]> {
    return this.tokenService.findAll();
  }
}
