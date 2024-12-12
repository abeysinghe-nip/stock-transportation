import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AdvancePayment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    stripeId: string;

    @Column()
    date: Date;

    @Column({ type: 'float' })
    amount: number;
}