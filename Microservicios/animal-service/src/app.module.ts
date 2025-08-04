/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AnimalModule } from './animal/animal.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './database/redis.module';

@Module({
  imports: [AnimalModule, DatabaseModule, RedisCacheModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // Specify the path to your .env file
  })],
})
export class AppModule { }
