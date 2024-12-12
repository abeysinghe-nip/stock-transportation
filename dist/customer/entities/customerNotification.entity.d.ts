import { Customer } from "./customer.entity";
export declare class CustomerNotification {
    id: string;
    date: Date;
    title: string;
    message: string;
    customer: Customer;
}
