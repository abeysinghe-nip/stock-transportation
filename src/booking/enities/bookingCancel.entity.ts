import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking.entity";

@Entity()
export class BookingCancel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column({ length: 500 })
    reason: string;

    @OneToOne(() => Booking)
    @JoinColumn()
    booking: Booking;
}