import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';
import { AnimalService } from './services/animal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalDomestico } from './entities/animal.entity';
import { RedisCacheModule } from 'src/database/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnimalDomestico]),
    RedisCacheModule
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule { }
