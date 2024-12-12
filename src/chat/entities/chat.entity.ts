import { Customer } from "src/customer/entities/customer.entity";
import { Owner } from "src/owner/entities/owner.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    createdDate: Date;

    @Column({ type: 'longtext' })
    messages: string;

    @ManyToOne(() => Customer, (customer) => customer.chat)
    customer: Customer;

    @ManyToOne(() => Owner, (owner) => owner.chat)
    owner: Owner;
}