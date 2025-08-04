import { Module } from '@nestjs/common';
import { AdoptionModule } from './adoption/adoption.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './database/redis.module';

@Module({
  imports: [AdoptionModule, DatabaseModule, RedisCacheModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // Specify the path to your .env file
  })],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
