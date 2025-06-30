import { IsString, MinLength, IsEmail } from 'class-validator';

export class loginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
