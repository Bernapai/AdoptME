import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './user-integration/user.controller';
import { AnimalController } from './animal-integration/animal.controller';
import { AdoptionController } from './adoption-integration/adoption.controller';
import { AppointmentsController } from './appointment-integration/appointment.controller';
import { UsersService } from './user-integration/user.service';
import { AnimalService } from './animal-integration/animal.service';
import { AdoptionService } from './adoption-integration/adoption.service';
import { AppointmentsService } from './appointment-integration/appointment.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP, // O cualquier tipo de transporte
        options: { host: 'localhost', port: 3001 },
      },
      {
        name: 'ANIMAL_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },
      {
        name: 'ADOPTION_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3003 },
      },
      {
        name: 'APPOINTMENT_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3004 },
      },
    ]),
  ],
  controllers: [
    UsersController,
    AnimalController,
    AdoptionController,
    AppointmentsController,
  ],
  providers: [
    UsersService,
    AnimalService,
    AdoptionService,
    AppointmentsService,
  ],
})
export class AppModule { }
