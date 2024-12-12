import { Driver } from "src/driver/entities/driver.entity";
export declare class BalPayment {
    id: string;
    stripeId: string;
    date: Date;
    amount: number;
    driver: Driver;
}
