import { UserActivatedEvent, UserCreatedEvent } from '@common/events';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
  EventStoreSubscription,
} from '@juicycleff/nestjs-event-store';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateAccountHandler } from './cqrs/commands/handler/create-account.handler';
import { CreateUserSaga } from './cqrs/sagas/create-user.saga';
import { Account } from './models/account.model';
import { AccountResolver } from './resolvers/account.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { AccountService } from './services/account.service';

// Module
const services = [AccountService];
const resolvers = [AccountResolver, UserResolver];
const commandHandlers = [CreateAccountHandler];
const sagas = [CreateUserSaga];

// TypeOrm
const entities = [Account];

// EventStore
const featureStreamName = '$svc-account';
const subscriptions: EventStoreSubscription[] = [
  {
    type: EventStoreSubscriptionType.Persistent,
    stream: '$svc-user',
    persistentSubscriptionName: 'account',
  },
];
const eventHandlers = {
  UserCreatedEvent: (data) => new UserCreatedEvent(data),
  UserActivatedEvent: (data) => new UserActivatedEvent(data),
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
export class AccountModule {}
