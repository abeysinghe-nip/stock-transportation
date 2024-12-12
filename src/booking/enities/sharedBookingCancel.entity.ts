import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SharedBooking } from "./sharedBooking.entity";

@Entity()
export class SharedBookingCancel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    date: Date;

    @Column({ length: 500 })
    reason: string;

    @OneToOne(() => SharedBooking)
    @JoinColumn()
    sharedBooking: SharedBooking;

}