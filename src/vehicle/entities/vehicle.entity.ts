import { Booking } from "src/booking/enities/booking.entity";
import { DriverVehicle } from "src/driver/entities/driver.vehicle.entity";
import { Owner } from "src/owner/entities/owner.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 15 })
    type: string;

    @Column({ length: 15 })
    regNo: string;

    @Column({ length: 25 })
    preferredArea: string;

    @Column({ nullable: false })
    capacity: number;

    @Column({ length: 15, nullable: false })
    capacityUnit: string;

    @Column({ length: 300 })
    photoUrl: string;

    @Column({ length: 250 })
    vehicleBookUrl: string;

    @Column({ type: 'float' })
    chargePerKm: number;

    @Column()
    heavyVehicle: boolean;

    @Column({ default: true })
    enabled: boolean;

    @Column({ default: false })
    deleted: boolean;

    @ManyToOne(() => Owner, (owner) => owner.vehicles)
    owner: Owner;

    @OneToMany(() => DriverVehicle, (driverVehicle) => driverVehicle.vehicle)
    driverVehicle: DriverVehicle[];

    @OneToMany(() => Booking, (booking) => booking.vehicle)
    booking: Booking[];
}