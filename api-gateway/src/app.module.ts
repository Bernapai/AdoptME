import { Module } from '@nestjs/common';
import { UsersModule } from './user-integration/user.module';
import { AnimalModule } from './animal-integration/animal.module';
import { AdoptionModule } from './adoption-integration/adoption.module';
import { AppointmentModule } from './appointment-integration/appointment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AnimalModule,
    AdoptionModule,
    AppointmentModule,
    AuthModule,
  ],
})
export class AppModule { }
