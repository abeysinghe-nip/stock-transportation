import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./owner.entity";
import { OwnerCredit } from "./ownerCredit.entity";
import { OwnerDebit } from "./ownerDebit.entity";

@Entity()
export class OwnerWallet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float', default: 0 })
    earnings: number;

    @Column({ type: 'float', default: 0 })
    withdrawals: number;

    @Column({ nullable: true })
    holderName: string;

    @Column({ nullable: true })
    bank: string;

    @Column({ nullable: true })
    branch: string;

    @Column({ nullable: true })
    accNumber: string;

    @Column({ length: 300, nullable: true })
    dwollaUrl: string;

    @OneToOne(() => Owner)
    @JoinColumn()
    owner: Owner;

    @OneToMany(() => OwnerCredit, (ownerCredit) => ownerCredit.wallet)
    ownerCredit: OwnerCredit[];

    @OneToMany(() => OwnerDebit, (ownerDebit) => ownerDebit.wallet)
    ownerDebit: OwnerDebit[];
}