import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id?: number;

  @Field()
  @Column()
  firstName?: string;

  @Field()
  @Column()
  lastName?: string;

  @Field()
  @Column({ default: true })
  isActive?: boolean;
}
