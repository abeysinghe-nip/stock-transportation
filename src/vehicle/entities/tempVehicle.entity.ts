import { Owner } from "src/owner/entities/owner.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TempVehicle{
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

    @Column({ type: 'float', default: 0 })
    chargePerKm: number;

    @Column()
    heavyVehicle: boolean;

    @ManyToOne(() => Owner, (owner) => owner.vehicles)
    owner: Owner;
}