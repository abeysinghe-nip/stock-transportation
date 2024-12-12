import { Owner } from "src/owner/entities/owner.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TempDriver {
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
    policeCertiUrl: string;

    @Column({ length: 200, nullable: true })
    licenseUrl: string;

    @Column({ length: 200 })
    photoUrl: string;

    @Column()
    heavyVehicleLic: boolean;

    @ManyToOne(() => Owner, (owner) => owner.drivers)
    owner: Owner

}