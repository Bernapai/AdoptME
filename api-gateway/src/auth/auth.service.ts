import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginUserDto } from './dtos/userLogin.dto';
import { UsersService } from '../../../Microservicios/user-service/src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(user: loginUserDto) {
    const userFound = await this.userService.findByUsername(user.nombre);
    if (!userFound) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: userFound.nombre, sub: userFound.password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
