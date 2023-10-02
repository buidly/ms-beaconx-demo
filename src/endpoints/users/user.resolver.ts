import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';
import { CreateUserArgs } from './entities/args/create.user.args';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserArgs): Promise<User> {
    return await this.usersService.create(input);
  }

  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
