import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaRegistro: Date;
}
