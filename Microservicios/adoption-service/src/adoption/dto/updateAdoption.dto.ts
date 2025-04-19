import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EstadoAdopcion } from '../adoption.entity';
import { Type } from 'class-transformer';

export class UpdateAdopcionDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaAdopcion?: Date;

  @IsOptional()
  @IsUUID('4')
  adoptanteId?: string;

  @IsOptional()
  @IsUUID('4')
  mascotaId?: string;

  @IsOptional()
  @IsEnum(EstadoAdopcion)
  estado?: EstadoAdopcion;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsUUID('4')
  responsableRefugioId?: string;
}
