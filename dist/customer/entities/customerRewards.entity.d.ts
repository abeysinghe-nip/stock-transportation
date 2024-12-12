import { Customer } from "./customer.entity";
import { BalPayment } from "src/booking/enities/balPayment.entity";
export declare class CustomerRewards {
    id: string;
    date: Date;
    reward: number;
    isClaimed: boolean;
    customer: Customer;
    balPayment: BalPayment;
}
