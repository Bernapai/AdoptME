import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EstadoAdopcion } from '../entities/adoption.entity';
import { Type } from 'class-transformer';

export class CreateAdopcionDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaAdopcion: Date;

  @IsNotEmpty()
  @IsUUID('4')
  adoptanteId: string;

  @IsNotEmpty()
  @IsUUID('4')
  mascotaId: string;

  @IsOptional()
  @IsEnum(EstadoAdopcion)
  estado?: EstadoAdopcion;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsNotEmpty()
  @IsUUID('4')
  responsableRefugioId: string;
}
