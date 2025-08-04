import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { CreateUserDto } from '../../../Microservicios/user-service/src/users/dto/createUser.dto';
import { UpdateUserDto } from '../../../Microservicios/user-service/src/users/dto/updateUser.dto';
import { User } from '../../../Microservicios/user-service/src/users/entities/users.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ShortThrottle, LongThrottle, MediumThrottle } from 'src/config/decorators/custom-throttle.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente.', type: User })
  @ShortThrottle() // 5 creaciones por minuto - Restrictivo para evitar spam
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.', type: [User] })
  @MediumThrottle() // 500 requests por 5 minutos - Moderado para consultas masivas
  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.', type: User })
  @ShortThrottle() // 100 requests por minuto - Permisivo para consultas individuales
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.', type: User })
  @MediumThrottle() // 10 actualizaciones por minuto - Restrictivo
  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.usersService.update(Number(id), dto);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado.' })
  @ShortThrottle() // 3 eliminaciones por 5 minutos - Muy restrictivo
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(Number(id));
  }

  @ApiOperation({ summary: 'Buscar usuario por email' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado o null.', type: User, isArray: false })
  @ShortThrottle() // 30 búsquedas por minuto - Moderado para búsquedas públicas
  @Get('by-email')
  findByEmail(@Query('email') email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Buscar usuario por nombre de usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado o null.', type: User, isArray: false })
  @ShortThrottle() // 30 búsquedas por minuto - Moderado para búsquedas públicas
  @Get('by-username')
  findByUsername(@Query('nombre') nombre: string): Promise<User | null> {
    return this.usersService.findByUsername(nombre);
  }
}
