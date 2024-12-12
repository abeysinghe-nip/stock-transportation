import { Customer } from "src/customer/entities/customer.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CustomerFeedback {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    createdAt: Date;

    @Column({ length: 500 })
    feedback: string;

    @Column({ default: false })
    isApproved: boolean;

    @ManyToOne(() => Customer, (customer) => customer.customerFeedBack)
    customer: Customer;
}