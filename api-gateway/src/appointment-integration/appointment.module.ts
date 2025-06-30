import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'APPOINTMENT_SERVICE',
                transport: Transport.TCP,
                options: { host: 'localhost', port: 3003 },
            },
        ]),
        AuthModule,
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService],
})
export class AppointmentModule { }
