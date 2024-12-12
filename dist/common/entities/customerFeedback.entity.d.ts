import { Customer } from "src/customer/entities/customer.entity";
export declare class CustomerFeedback {
    id: string;
    createdAt: Date;
    feedback: string;
    isApproved: boolean;
    customer: Customer;
}
