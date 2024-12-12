import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Driver } from "./driver.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { Owner } from "src/owner/entities/owner.entity";


@Entity()
export class DriverVehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    assignedDate: Date;

    @Column({ nullable: true })
    removedDate: Date;

    @ManyToOne(() => Driver, (driver) => driver.driverVehicle)
    driver: Driver;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.driverVehicle)
    vehicle: Vehicle;

    @ManyToOne(() => Owner, (owner) => owner.driverVehicle)
    owner: Owner;
}