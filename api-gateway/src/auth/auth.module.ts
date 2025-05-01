import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../../../Microservicios/user-service/src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../../Microservicios/user-service/src/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Tipo de base de datos
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Juanber123()',
      database: 'usersAdoptme',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    JwtModule.register({
      secret: 'JksIJ093jJSo',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
