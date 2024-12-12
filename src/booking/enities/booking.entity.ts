import { Customer } from "src/customer/entities/customer.entity";
import { DriverVehicle } from "src/driver/entities/driver.vehicle.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdvancePayment } from "./advancePayment.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { BalPayment } from "./balPayment.entity";
import { SharedBooking } from "./sharedBooking.entity";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    createdAt: Date;

    @Column()
    bookingDate: Date;

    @Column()
    pickupTime: string;

    @Column({ default: 0 })
    loadingTime: number;

    @Column({ default: 0 })
    unloadingTime: number;

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
    vehicleCharge: number;

    @Column({ type: 'float'})
    serviceCharge: number;

    @Column({ type: 'float', default: 0 })
    handlingCharge: number;

    @Column({ type: 'float' })
    loadingCapacity: number;

    @Column({ default: false })
    isReturnTrip: boolean;

    @Column({ default: false })
    willingToShare: boolean;

    @Column()
    avgHandlingTime: number;

    @Column({ default: "upcoming", length: 15 })
    status: string;

    @Column({ default: false })
    isCancelled: boolean;

    @ManyToOne(() => Customer, (customer) => customer.booking)
    customer: Customer;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.booking)
    vehicle: Vehicle;

    @OneToOne(() => AdvancePayment)
    @JoinColumn()
    advancePayment: AdvancePayment;

    @OneToOne(() => BalPayment)
    @JoinColumn()
    balPayment: BalPayment;

    @OneToMany(() => SharedBooking, (sharedBooking) => sharedBooking.booking)
    sharedBooking: SharedBooking[];
}