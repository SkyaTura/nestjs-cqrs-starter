import { readFileSync, copyFileSync, existsSync } from 'fs';
import * as Yaml from 'js-yaml';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();

const YAML_CONFIG_FILENAME = resolve(__dirname, '../../../config.yaml');
const YAML_CONFIG_EXAMPLE_FILENAME = resolve(__dirname, '../../../config.yaml');

export interface Config {
  gateway: {
    port: number;
  };

  common: {
    eventStore: {
      type: 'event-store' | 'nats';
      tcpEndpoint: {
        host: string;
        port: number;
      };
      credentials: {
        type: string;
        username: string;
        password: string;
      };
    };
  };

  services: {
    [key: string]: {
      endpoint: string;
      database: {
        type: TypeOrmModuleOptions;
        prefix: string;
        url: string;
        logging: boolean;
      };
    };
  };
}

if (!existsSync(YAML_CONFIG_FILENAME))
  copyFileSync(YAML_CONFIG_EXAMPLE_FILENAME, YAML_CONFIG_FILENAME);

const file = readFileSync(YAML_CONFIG_FILENAME, 'utf8');

export const config: Config = Yaml.load(file) as Config;
