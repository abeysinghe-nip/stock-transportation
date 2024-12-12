import { Owner } from "./owner.entity";
export declare class OwnerNotification {
    id: string;
    date: Date;
    title: string;
    message: string;
    owner: Owner;
}
