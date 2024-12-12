import { Customer } from "src/customer/entities/customer.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CustomerOtp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    createdAt: Date;

    @Column({ length: 200 })
    otp: string;

    @ManyToOne(() => Customer, (customer) => customer.customerOtp)
    customer: Customer;
}