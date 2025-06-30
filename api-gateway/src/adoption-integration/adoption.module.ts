import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdoptionController } from './adoption.controller';
import { AdoptionService } from './adoption.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ADOPTION_SERVICE',
                transport: Transport.TCP,
                options: { host: 'localhost', port: 3001 },
            },
        ]),
    ],
    controllers: [AdoptionController],
    providers: [AdoptionService],
    exports: [AdoptionService],
})
export class AdoptionModule { }
