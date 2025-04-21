import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoCita } from '../appointment.entity';

export class CreateAppointmentDto {
  @IsDateString()
  fechaHora: Date;

  @IsUUID()
  adoptanteId: string;

  @IsUUID()
  mascotaId: string;

  @IsUUID()
  responsableRefugioId: string;

  @IsEnum(EstadoCita)
  @IsOptional()
  estado?: EstadoCita;

  @IsString()
  @IsOptional()
  notas?: string;
}
