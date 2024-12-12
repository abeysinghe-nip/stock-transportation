import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./owner.entity";
import { BalPayment } from "src/booking/enities/balPayment.entity";
import { OwnerDebit } from "./ownerDebit.entity";

@Entity()
export class OwnerRewards {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column()
    rewardAmount: number;

    @Column({ default: false })
    isClaimed: boolean;

    @ManyToOne(() => Owner, (owner) => owner.ownerRewards)
    owner: Owner;

    @OneToOne(() => OwnerDebit, { nullable: true })
    @JoinColumn()
    ownerDebit: OwnerDebit;
}