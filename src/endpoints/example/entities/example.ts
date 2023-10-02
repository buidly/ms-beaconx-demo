import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Example {
  @Field()
  id: string = '';

  @Field()
  description: string = '';

  public constructor(init?: Partial<Example>) {
    Object.assign(this, init);
  }
}
