import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../common/constants/pgconnection.constants';
import { ConfigService } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from '../config/config.interface';

@Global()
@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => {
        const dbConfig = configService.get<DatabaseConfig>('database')!;
        return new Pool({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.pass,
          database: dbConfig.name,
        });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DbModule {}
