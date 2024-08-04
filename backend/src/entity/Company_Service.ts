// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   BaseEntity,
//   ManyToMany,
//   DeleteDateColumn,
//   ManyToOne,
//   OneToMany,
//   OneToOne,
//   JoinColumn,
//   JoinTable,
// } from "typeorm";
// import { Service } from "./Service";
// import { Company } from "./Company";
// import { Booking } from "./Booking";

// @Entity("company_services")
// export class ServiceToCompany extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   price: string;

//   @Column({ nullable: true })
//   description: string;

//   @ManyToOne(() => Service, (service) => service.serviceToCompany, {
//     cascade: true,
//   })
//   service: Service;

//   @OneToMany(() => Booking, (Booking) => Booking.serviceToCompany, {
//     cascade: true,
//   })
//   booking: Booking[];

//   @ManyToOne(() => Company, (company) => company.ServiceToCompany)
//   company: Company;

//   @DeleteDateColumn({ name: "deletedAt", nullable: true })
//   deletedAt: Date;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { Service } from "./Service";
import { Company } from "./Company";
import { Booking } from "./Booking";

@Entity("company_services")
export class ServiceToCompany extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Service, (service) => service.serviceToCompany, {
    cascade: ["insert", "update"],
  })
  service: Service;

  @OneToMany(() => Booking, (booking) => booking.serviceToCompany, {
    cascade: ["insert", "update"],
    onDelete: "CASCADE",
  })
  bookings: Booking[];

  @ManyToOne(() => Company, (company) => company.ServiceToCompany)
  company: Company;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt: Date;
}
