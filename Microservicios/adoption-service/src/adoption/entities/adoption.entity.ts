import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Enum para los estados posibles
export enum EstadoAdopcion {
  PENDIENTE = 'pendiente',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Entity()
export class Adopcion {
  @PrimaryGeneratedColumn('uuid')
  idAdopcion: string;

  @Column({ type: 'timestamp' })
  fechaAdopcion: Date;

  @Column('uuid')
  adoptanteId: string;

  @Column('uuid')
  mascotaId: string;

  @Column({
    type: 'enum',
    enum: EstadoAdopcion,
    default: EstadoAdopcion.PENDIENTE,
  })
  estado: EstadoAdopcion;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column('uuid')
  responsableRefugioId: string;
}
