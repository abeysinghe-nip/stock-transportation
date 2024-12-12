import { Owner } from "src/owner/entities/owner.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OwnerOtp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    createdAt: Date;

    @Column({ length: 200 })
    otp: string;

    @ManyToOne(() => Owner, (owner) => owner)
    owner: Owner;
}