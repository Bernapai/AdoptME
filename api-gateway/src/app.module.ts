import { Module } from '@nestjs/common';
import { UsersModule } from './user-integration/user.module';
import { AnimalModule } from './animal-integration/animal.module';
import { AdoptionModule } from './adoption-integration/adoption.module';
import { AppointmentModule } from './appointment-integration/appointment.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { rateLimitConfig } from './config/rate-limit.config';

@Module({
  imports: [
    UsersModule,
    AnimalModule,
    AdoptionModule,
    AppointmentModule,
    AuthModule,
    ThrottlerModule.forRoot(rateLimitConfig),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
