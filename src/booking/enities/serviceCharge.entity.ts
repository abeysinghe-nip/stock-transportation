import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking.entity";
import { SharedBooking } from "./sharedBooking.entity";

@Entity()
export class ServiceCharge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column({ type: 'float' })
    amount: number;

    @Column({ default: 'completed' })
    type: string;

    @OneToOne(() => Booking)
    @JoinColumn()
    booking?: Booking;

    @OneToOne(() => SharedBooking)
    @JoinColumn()
    sharedBooking?: SharedBooking;
}