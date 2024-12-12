import { Driver } from "src/driver/entities/driver.entity";
import { DriverVehicle } from "src/driver/entities/driver.vehicle.entity";
import { TempDriver } from "src/driver/entities/tempDriver.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OwnerCredit } from "./ownerCredit.entity";
import { OwnerRewards } from "./ownerRewards.entity";
import { OwnerNotification } from "./ownerNotification.entity";
import { Chat } from "src/chat/entities/chat.entity";
import { OwnerOtp } from "src/common/entities/ownerOtp.entity";

@Entity()
export class Owner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, })
    firstName: string;

    @Column({ length: 50 })
    lastName: string;

    @Column({ length: 250 })
    address: string;

    @Column({ length: 12, unique: true })
    nic: string;

    @Column({ length: 150, unique: true })
    email: string

    @Column({ length: 12 })
    mobNumber: string;

    @Column({ length: 200 })
    password: string;

    @Column({ length: 200 })
    gsCertiUrl: string;

    @Column({ length: 200, nullable: true })
    profilePic: string;

    @OneToMany(() => TempDriver, (tempDriver) => tempDriver.owner)
    tempDrivers: TempDriver[];

    @OneToMany(() => Driver, (driver) => driver.owner)
    drivers: Driver[];

    @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
    vehicles: Vehicle[];

    @OneToMany(() => DriverVehicle, (driverVehicle) => driverVehicle.owner)
    driverVehicle: DriverVehicle[];

    @OneToMany(() => OwnerRewards, (ownerRewards) => ownerRewards.owner)
    ownerRewards: OwnerRewards[];

    @OneToMany(() => OwnerNotification, (ownerNotification) => ownerNotification)
    ownerNotification: OwnerNotification[];

    @OneToMany(() => Chat, (chat) => chat.owner)
    chat: Chat[];

    @OneToMany(() => OwnerOtp, (ownerOtp) => ownerOtp.owner)
    ownerOtp: OwnerOtp[];

}