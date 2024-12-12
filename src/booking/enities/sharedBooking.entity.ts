import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking.entity";
import { AdvancePayment } from "./advancePayment.entity";
import { BalPayment } from "./balPayment.entity";
import { Customer } from "src/customer/entities/customer.entity";

@Entity()
export class SharedBooking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float' })
    startLong: number;

    @Column({ type: 'float' })
    startLat: number;

    @Column({ type: 'float' })
    destLong: number;

    @Column({ type: 'float' })
    destLat: number;

    @Column({ type: 'float' })
    travellingTime: number;

    @Column({ type: 'float' })
    avgHandlingTime: number;

    @Column({ default: 0 })
    loadingTime: number;

    @Column({ default: 0 })
    unloadingTime: number;

    @Column({ type: 'float' })
    vehicleCharge: number;

    @Column({ type: 'float' })
    serviceCharge: number;

    @Column({ default: 'upcoming' })
    status: string;

    @Column({ default: false })
    isCancelled: boolean;

    @ManyToOne(() => Booking, (booking) => booking.sharedBooking)
    @JoinColumn()
    booking: Booking;

    @OneToOne(() => AdvancePayment)
    @JoinColumn()
    advancePayment: AdvancePayment;

    @OneToOne(() => BalPayment)
    @JoinColumn()
    balPayment: BalPayment;

    @ManyToOne(() => Customer, (customer) => customer.sharedBooking)
    customer: Customer
}