import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";

import { UserProfile } from "./UserProfile";
import { Role } from "./Role";
import { Company } from "./Company";
import { Booking } from "./Booking";


@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserProfile, { cascade: true })
  @JoinColumn()
  profile: UserProfile;

  @OneToMany(() => Booking, (booking) => booking.user, { cascade: true })
  bookings: Booking[];

  @OneToMany(() => Company, (company) => company.user, { cascade: true })
  company: Company[];

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({ name: "user_roles" })
  roles: Role[];
}
