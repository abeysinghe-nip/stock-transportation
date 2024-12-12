import { Customer } from "src/customer/entities/customer.entity";
export declare class CustomerOtp {
    id: string;
    createdAt: Date;
    otp: string;
    customer: Customer;
}
