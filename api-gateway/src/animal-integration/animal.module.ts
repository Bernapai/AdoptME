import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ANIMAL_SERVICE',
                transport: Transport.TCP,
                options: { host: 'localhost', port: 3002 },
            },
        ]),
        AuthModule,
    ],
    controllers: [AnimalController],
    providers: [AnimalService],
    exports: [AnimalService],
})
export class AnimalModule { }
