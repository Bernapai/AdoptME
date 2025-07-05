import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';
import { AnimalService } from './animal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalDomestico } from './entities/animal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnimalDomestico]),
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule { }
