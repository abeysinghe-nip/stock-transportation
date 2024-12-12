import { Driver } from "src/driver/entities/driver.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DriverOtp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    createdAt: Date;

    @Column({ length: 200 })
    otp: string;

    @ManyToOne(() => Driver, (driver) => driver)
    driver: Driver;
}