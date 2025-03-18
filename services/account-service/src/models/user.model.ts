import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'User' | 'GameMaster';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string; // Store hashed passwords 

  @Column({ type: 'enum', enum: ['User', 'GameMaster'], default: 'User' })
  role!: UserRole;
}
