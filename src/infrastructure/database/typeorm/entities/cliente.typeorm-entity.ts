import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('clientes')
export class ClienteTypeOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
