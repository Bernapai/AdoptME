import {
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { EspecieMascota, EstadoSalud } from '../animal.entity';

export class CreateAnimalDomesticoDto {
  @IsString()
  nombre: string;

  @IsEnum(EspecieMascota)
  especie: EspecieMascota;

  @IsString()
  raza: string;

  @IsInt()
  edad: number;

  @IsDateString()
  fechaIngreso: string;

  @IsEnum(EstadoSalud)
  @IsOptional()
  estadoSalud?: EstadoSalud;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
