import { Module } from '@nestjs/common';
import { AdoptionModule } from './adoption/adoption.module';

@Module({
  imports: [AdoptionModule],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
