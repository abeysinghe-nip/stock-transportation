import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking.entity";
import { Customer } from "src/customer/entities/customer.entity";
import { Driver } from "src/driver/entities/driver.entity";
import { SharedBooking } from "./sharedBooking.entity";

@Entity()
export class RateReview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column()
    rate: number;

    @Column({ length: 500, nullable: true })
    review?: string;

    @OneToOne(() => Booking, { nullable: true })
    @JoinColumn()
    booking: Booking;

    @OneToOne(() => SharedBooking, { nullable: true })
    @JoinColumn()
    sharedBooking: SharedBooking;

    @ManyToOne(() => Customer, (customer) => customer.rateReview)
    customer: Customer;

    @ManyToOne(() => Driver, (driver) => driver.rateReview)
    driver: Driver;
}