import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'USERS_SERVICE',
                transport: Transport.TCP,
                options: { host: 'localhost', port: 3004 },
            },
        ]),
        AuthModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
