import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdoptionController } from './adoption.controller';
import { AdoptionService } from './adoption.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ADOPTION_SERVICE',
                transport: Transport.TCP,
                options: { host: 'localhost', port: 3001 },
            },
        ]),
        AuthModule,
    ],
    controllers: [AdoptionController],
    providers: [AdoptionService],
    exports: [AdoptionService],
})
export class AdoptionModule { }
