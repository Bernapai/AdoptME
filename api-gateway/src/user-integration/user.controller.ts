import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from '../../../Microservicios/user-service/src/users/dto/createUser.dto';
import { UpdateUserDto } from '../../../Microservicios/user-service/src/users/dto/updateUser.dto';
import { User } from '../../../Microservicios/user-service/src/users/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.usersService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-email')
  findByEmail(@Query('email') email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-username')
  findByUsername(@Query('nombre') nombre: string): Promise<User | null> {
    return this.usersService.findByUsername(nombre);
  }
}
