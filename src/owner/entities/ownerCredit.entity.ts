import { Booking } from "src/booking/enities/booking.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./owner.entity";
import { OwnerWallet } from "./ownerWallet.entity";
import { SharedBooking } from "src/booking/enities/sharedBooking.entity";

@Entity()
export class OwnerCredit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column({ type: 'float' })
    amount: number;

    @OneToOne(() => Booking)
    @JoinColumn()
    booking: Booking;

    @OneToOne(() => SharedBooking)
    @JoinColumn()
    sharedBooking: SharedBooking;

    @ManyToOne(() => OwnerWallet, (ownerWallet) => ownerWallet.ownerCredit)
    wallet: OwnerWallet;
}