import { Customer } from "src/customer/entities/customer.entity";
import { Owner } from "src/owner/entities/owner.entity";
export declare class Chat {
    id: string;
    createdDate: Date;
    messages: string;
    customer: Customer;
    owner: Owner;
}
