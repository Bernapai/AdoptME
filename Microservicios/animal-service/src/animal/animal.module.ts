import { Module } from '@nestjs/common';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalDomestico } from './animal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnimalDomestico]),
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule { }
