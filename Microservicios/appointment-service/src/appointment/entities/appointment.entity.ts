import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Enum para los estados de cita
export enum EstadoCita {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  idCita: number;

  @Column({ type: 'timestamp' })
  fechaHora: Date;

  @Column('uuid')
  adoptanteId: string;

  @Column('uuid')
  mascotaId: string;

  @Column('uuid')
  responsableRefugioId: string;

  @Column({
    type: 'enum',
    enum: EstadoCita,
    default: EstadoCita.PENDIENTE,
  })
  estado: EstadoCita;

  @Column({ type: 'text', nullable: true })
  notas?: string;
}
