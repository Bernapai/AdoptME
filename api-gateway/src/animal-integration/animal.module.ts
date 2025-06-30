import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ANIMAL_SERVICE',
                transport: Transport.TCP,
                options: { host: 'localhost', port: 3002 },
            },
        ]),
    ],
    controllers: [AnimalController],
    providers: [AnimalService],
    exports: [AnimalService],
})
export class AnimalModule { }
