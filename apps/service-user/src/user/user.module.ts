import { AccountCreatedEvent } from '@common/events';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivateUserHandler } from './cqrs/commands/handlers/activate-user.handler';
import { CreateUserHandler } from './cqrs/commands/handlers/create-user.handler';
import { CreateUserSaga } from './cqrs/sagas/create-user.saga';
import { User } from './models/user.model';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';

// Module
const services = [UserService];
const resolvers = [UserResolver];
const commandHandlers = [CreateUserHandler, ActivateUserHandler];
const sagas = [CreateUserSaga];

// TypeOrm
const entities = [User];

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
    TypeOrmModule.forFeature(entities),
  ],
  providers: [...services, ...resolvers, ...commandHandlers, ...sagas],
})
export class UserModule {}
