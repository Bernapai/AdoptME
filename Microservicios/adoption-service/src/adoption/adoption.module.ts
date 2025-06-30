import { Module } from '@nestjs/common';
import { AdoptionController } from './adoption.controller';
import { AdoptionService } from './adoption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adopcion } from './adoption.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adopcion]), // Import the Adopcion entity
  ],
  controllers: [AdoptionController],
  providers: [AdoptionService]
})
export class AdoptionModule { }
