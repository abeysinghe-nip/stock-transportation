import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Driver } from "./driver.entity";

@Entity()
export class DriverNotification{
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    date: Date;

    @Column()
    title: string;

    @Column({length: 500})
    message: string;

    @ManyToOne(() => Driver, (driver) => driver.driverNotification)
    driver: Driver;
}