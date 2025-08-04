import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { loginUserDto } from './dtos/userLogin.dto';
import { RegisterUserDto } from './dtos/registerDto';
import { ShortThrottle, MediumThrottle } from 'src/config/decorators/custom-throttle.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado correctamente.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @ShortThrottle() // 10 logins por minuto - Restrictivo para evitar ataques de fuerza bruta
  @Post('login')
  async login(@Body() user: loginUserDto) {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Registro de nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente.' })
  @ApiResponse({ status: 400, description: 'Error en el registro.' })
  @MediumThrottle() // 10 registros por minuto - Moderado para evitar spam
  @Post('register')
  async register(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }
}
