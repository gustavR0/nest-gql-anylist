import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Float)
  @Column()
  quantity: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  quantityUnit: string; // g, ml, kg, tsp
}
