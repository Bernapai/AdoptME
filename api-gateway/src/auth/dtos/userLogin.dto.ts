import { IsString, MinLength } from 'class-validator';

export class loginUserDto {
  @IsString()
  nombre: string;

  @IsString()
  @MinLength(6)
  password: string;
}
