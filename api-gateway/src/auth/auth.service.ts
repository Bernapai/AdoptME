import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/user-integration/user.service';  // Servicio que llama a API Gateway Users
import { loginUserDto } from './dtos/userLogin.dto';
import { RegisterUserDto } from './dtos/registerDto';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  // Registro de usuario: crea usuario con password hasheada
  async register(registerDto: RegisterUserDto): Promise<User> {
    const { email, nombre, password } = registerDto;

    // Verificar si usuario ya existe por email
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con password hasheada
    const userToCreate = {
      email,
      nombre,
      password: hashedPassword,
    };

    const newUser = await this.usersService.create(userToCreate);;

    return newUser;
  }

  // Login: valida usuario y devuelve JWT
  async login(loginDto: loginUserDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validar contraseña con bcrypt
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar JWT con payload mínimo (ejemplo: userId y email)
    const payload = { sub: user.idUser, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
