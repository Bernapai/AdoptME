import { Module } from '@nestjs/common';
import { AdoptionController } from './controllers/adoption.controller';
import { AdoptionService } from './services/adoption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adopcion } from './entities/adoption.entity';
import { RedisCacheModule } from 'src/database/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adopcion]),
    RedisCacheModule // Import the Adopcion entity
  ],
  controllers: [AdoptionController],
  providers: [AdoptionService]
})
export class AdoptionModule { }
