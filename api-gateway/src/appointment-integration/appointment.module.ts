import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'APPOINTMENT_SERVICE',
                transport: Transport.TCP,
                options: { host: 'localhost', port: 3003 },
            },
        ]),
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService],
})
export class AppointmentModule { }
