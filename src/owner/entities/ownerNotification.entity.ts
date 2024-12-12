import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./owner.entity";

@Entity()
export class OwnerNotification {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    date: Date;

    @Column()
    title: string;

    @Column({length: 500})
    message: string;

    @ManyToOne(() => Owner, (owner) => owner.ownerNotification)
    owner: Owner;
}