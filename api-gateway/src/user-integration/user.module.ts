import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'USERS_SERVICE',
                transport: Transport.TCP,
                options: { host: 'localhost', port: 3004 },
            },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
