/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AnimalModule } from './animal/animal.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AnimalModule, DatabaseModule],
})
export class AppModule { }
