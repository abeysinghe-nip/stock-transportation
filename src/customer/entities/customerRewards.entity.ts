import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { BalPayment } from "src/booking/enities/balPayment.entity";

@Entity()
export class CustomerRewards {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column('decimal', { precision: 6, scale: 2 })
    reward: number;

    @Column({ default: false })
    isClaimed: boolean;

    @ManyToOne(() => Customer, (customer) => customer.customerRewards)
    customer: Customer;

    @OneToOne(() => BalPayment, {nullable: true})
    @JoinColumn()
    balPayment: BalPayment;
}