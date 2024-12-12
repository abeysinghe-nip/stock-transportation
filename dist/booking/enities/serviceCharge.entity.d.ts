import { Booking } from "./booking.entity";
import { SharedBooking } from "./sharedBooking.entity";
export declare class ServiceCharge {
    id: string;
    date: Date;
    amount: number;
    type: string;
    booking?: Booking;
    sharedBooking?: SharedBooking;
}
