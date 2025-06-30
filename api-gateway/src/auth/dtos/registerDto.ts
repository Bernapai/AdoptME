import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
    @IsString()
    nombre: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
