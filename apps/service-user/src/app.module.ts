import { EventStoreModule } from '@juicycleff/nestjs-event-store';
import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@common/config';

import { User } from './user/models/user.model';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

// Customization
const entities = [User];
const module = UserModule;
const moduleName = 'user';

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
    MongooseModule.forRoot('mongodb://localhost/admin', {
      dbName: 'microservices-nestjs',
      user: 'root',
      pass: 'example',
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
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
    module,
  ],
})
export class AppModule {}
