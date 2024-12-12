import { Owner } from "src/owner/entities/owner.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DriverVehicle } from "./driver.vehicle.entity";
import { BalPayment } from "src/booking/enities/balPayment.entity";
import { RateReview } from "src/booking/enities/rateReview.entity";
import { DriverNotification } from "./driverNotification.entity";
import { DriverOtp } from "src/common/entities/driverOtp.entity";

@Entity()
export class Driver {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 50 })
    lastName: string;

    @Column({ length: 12 })
    phoneNumber: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ length: 250 })
    address: string;

    @Column({ length: 200 })
    password: string;

    @Column({ length: 200 })
    policeCertiUrl: string;

    @Column({ length: 200 })
    licenseUrl: string;

    @Column({ length: 200 })
    photoUrl: string;

    @Column()
    heavyVehicleLic: boolean;

    @Column({ default: true })
    enabled: boolean;

    @Column({ default: false })
    deleted: boolean;

    @ManyToOne(() => Owner, (owner) => owner)
    owner: Owner;

    @OneToMany(() => DriverVehicle, (driverVehicle) => driverVehicle.driver)
    driverVehicle: DriverVehicle[];

    @OneToMany(() => BalPayment, (balPayment) => balPayment.driver)
    balPayment: BalPayment[];

    @OneToMany(() => RateReview, (rateReview) => rateReview.driver)
    rateReview: RateReview[];

    @OneToMany(() => DriverNotification, (driverNotification) => driverNotification.driver)
    driverNotification: DriverNotification[];

    @OneToMany(() => DriverOtp, (driverOtp) => driverOtp.driver)
    driverOtp: DriverOtp[];
}