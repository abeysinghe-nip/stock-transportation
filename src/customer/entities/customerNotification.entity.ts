import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";

@Entity()
export class CustomerNotification {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    date: Date;

    @Column()
    title: string;

    @Column({length: 500})
    message: string;

    @ManyToOne(() => Customer, (customer) => customer.customerNotification)
    customer: Customer;
}