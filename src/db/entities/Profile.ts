import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { IsInt } from 'class-validator';

export interface ProfileData {
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
}

@Entity({ name: 'profile' })
export default class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ type: 'json' })
  data: ProfileData;
}
