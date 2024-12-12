import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OwnerWallet } from "./ownerWallet.entity";

@Entity()
export class OwnerDebit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column({ type: 'float' })
    amount: number;

    @ManyToOne(() => OwnerWallet, (ownerWallet) => ownerWallet.ownerDebit)
    wallet: OwnerWallet;
}