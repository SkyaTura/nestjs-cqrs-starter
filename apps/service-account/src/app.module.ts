import { EventStoreModule } from '@juicycleff/nestjs-event-store';
import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@common/config';

import { AccountModule } from './account/account.module';
import { Account } from './account/models/account.model';

// Customization
const entities = [Account];
const module = AccountModule;
const moduleName = 'account';

// Do not change
const moduleConfig = config.services[moduleName];
const eventStoreConfig = config.common.eventStore;
const databaseUrl =
  process.env[`SVC_${moduleName.toUpperCase()}_DB_URL`] ||
  moduleConfig.database.url;

@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: true,
    }),
    EventStoreModule.register({
      type: 'event-store',
      tcpEndpoint: {
        host: process.env.EVENT_STORE_HOST || eventStoreConfig.tcpEndpoint.host,
        port:
          parseInt(process.env.EVENT_STORE_PORT, 10) ||
          eventStoreConfig.tcpEndpoint.port,
      },
      options: {
        defaultUserCredentials: {
          username:
            process.env.EVENT_STORE_USERNAME ||
            eventStoreConfig.credentials.username,
          password:
            process.env.EVENT_STORE_PASSWORD ||
            eventStoreConfig.credentials.password,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: databaseUrl,
      database: databaseUrl.split('/').pop(),
      entityPrefix:
        process.env[`SVC_${moduleName.toUpperCase()}_DB_URL`] ||
        moduleConfig.database.prefix,
      entities,
      synchronize: true,
      logging:
        process.env[`SVC_${moduleName.toUpperCase()}_DB_LOGGING`] === 'true' ||
        moduleConfig.database.logging,
    }),
    module,
  ],
})
export class AppModule {}
