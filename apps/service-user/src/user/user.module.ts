import { AccountCreatedEvent } from '@common/events';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ActivateUserHandler } from './cqrs/commands/handlers/activate-user.handler';
import { CreateUserHandler } from './cqrs/commands/handlers/create-user.handler';
import { CreateUserSaga } from './cqrs/sagas/create-user.saga';
import { User, UserSchema } from './models/user.model';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';

// Module
const services = [UserService];
const resolvers = [UserResolver];
const commandHandlers = [CreateUserHandler, ActivateUserHandler];
const sagas = [CreateUserSaga];

// EventStore
const featureStreamName = '$svc-user';
const subscriptions = [
  {
    type: EventStoreSubscriptionType.Persistent,
    stream: '$svc-account',
    persistentSubscriptionName: 'user',
  },
];
const eventHandlers = {
  AccountCreatedEvent: (data) => new AccountCreatedEvent(data),
};

// Do not change
@Module({
  imports: [
    CqrsModule,
    EventStoreModule.registerFeature({
      type: 'event-store',
      featureStreamName,
      subscriptions,
      eventHandlers,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    ...services,
    ...resolvers,
    ...commandHandlers,
    ...sagas,
    UserRepository,
  ],
})
export class UserModule {}
