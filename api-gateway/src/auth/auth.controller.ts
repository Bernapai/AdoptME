import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dtos/userLogin.dto';
import { RegisterUserDto } from './dtos/registerDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(user: loginUserDto) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(user: RegisterUserDto) {
    return this.authService.register(user);
  }
}
