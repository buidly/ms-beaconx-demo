import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@ObjectType()
@Schema()
export class Token {
  @Field()
  @Prop({ required: true })
  identifier!: string;

  @Field()
  @Prop()
  name!: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  accounts?: number;

  @Field(() => Int, { nullable: true })
  @Prop()
  transactions?: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
