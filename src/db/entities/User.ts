import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { IsEmail, IsUUID, IsInt } from 'class-validator';
import Profile from './Profile';

@Entity({ name: 'user' })
export default class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['email'])
  @IsEmail()
  email: string;

  @Column()
  password_hash: string;

  @Column()
  auth_type: number;

  @Column()
  @Unique(['auth_token'])
  @IsUUID()
  auth_token: string;

  @Column()
  @Unique(['confirmation_token'])
  @IsUUID()
  confirmation_token: string;

  @Column()
  @IsUUID()
  password_reset_token: string;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column()
  role: string;

  @Column()
  @IsInt()
  status: number;

  @Column()
  @IsInt()
  profile_id: number;
}
