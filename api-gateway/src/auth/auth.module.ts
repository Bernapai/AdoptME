import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/user-integration/user.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'JksIJ093jJSo',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],

})
export class AuthModule { }
