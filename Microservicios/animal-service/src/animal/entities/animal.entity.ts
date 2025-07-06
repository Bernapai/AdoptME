import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Enum para especie
export enum EspecieMascota {
  PERRO = 'perro',
  GATO = 'gato',
  OTRO = 'otro',
}

// Enum para estado de salud
export enum EstadoSalud {
  SANO = 'sano',
  ENFERMO = 'enfermo',
  EN_TRATAMIENTO = 'en tratamiento',
}

@Entity()
export class AnimalDomestico {
  @PrimaryGeneratedColumn('uuid')
  idMascota: number;

  @Column()
  nombre: string;

  @Column({
    type: 'enum',
    enum: EspecieMascota,
  })
  especie: EspecieMascota;

  @Column()
  raza: string;

  @Column('int')
  edad: number;

  @Column({ type: 'timestamp' })
  fechaIngreso: Date;

  @Column({
    type: 'enum',
    enum: EstadoSalud,
    default: EstadoSalud.SANO,
  })
  estadoSalud: EstadoSalud;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;
}
