import { Module } from '@nestjs/common';
import { AdoptionController } from './controllers/adoption.controller';
import { AdoptionService } from './services/adoption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adopcion } from './entities/adoption.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adopcion]), // Import the Adopcion entity
  ],
  controllers: [AdoptionController],
  providers: [AdoptionService]
})
export class AdoptionModule { }
