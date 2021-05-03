import { UserActivatedEvent, UserCreatedEvent } from '@common/events';
import { IUser, UserStatus } from '@common/interfaces';
import { AggregateRoot } from '@nestjs/cqrs';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Directive(`@key(fields: "id")`)
@ObjectType()
@Schema({ timestamps: true })
export class User extends AggregateRoot implements IUser {
  @Field(() => ID)
  @Prop()
  id: string;

  @Field()
  @Prop()
  name: string;

  @Field({ nullable: true })
  @Prop()
  nickName?: string;

  @Prop({ type: 'String', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  createUser() {
    this.apply(new UserCreatedEvent(this));
  }

  activateUser() {
    this.apply(new UserActivatedEvent(this));
  }
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
