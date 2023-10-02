import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ExampleArgs {
  @Field(() => Int, { defaultValue: 0 })
  public from!: number;

  @Field(() => Int, { defaultValue: 25 })
  public size!: number;

  @Field({ nullable: true })
  public search?: string;
}
