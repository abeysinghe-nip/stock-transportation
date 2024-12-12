import { Booking } from "./booking.entity";
import { Customer } from "src/customer/entities/customer.entity";
import { Driver } from "src/driver/entities/driver.entity";
import { SharedBooking } from "./sharedBooking.entity";
export declare class RateReview {
    id: string;
    date: Date;
    rate: number;
    review?: string;
    booking: Booking;
    sharedBooking: SharedBooking;
    customer: Customer;
    driver: Driver;
}
