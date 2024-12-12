import { Driver } from "src/driver/entities/driver.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BalPayment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    stripeId: string;

    @Column()
    date: Date;

    @Column({ type: 'float' })
    amount: number;

    @ManyToOne(() => Driver, (driver) => driver.balPayment)
    driver: Driver;
}