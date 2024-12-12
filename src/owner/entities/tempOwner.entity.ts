import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TempOwner {
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
}