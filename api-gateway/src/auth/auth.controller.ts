import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dtos/userLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(user: loginUserDto) {
    return this.authService.login(user);
  }
}
