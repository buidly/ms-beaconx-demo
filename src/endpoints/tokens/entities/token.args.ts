import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTokenArgs {
  @Field()
  identifier!: string;

  @Field()
  name!: string;
}
