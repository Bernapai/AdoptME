import { Module } from '@nestjs/common';
import { AdoptionModule } from './adoption/adoption.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AdoptionModule, DatabaseModule],
})
export class AppModule { } }
