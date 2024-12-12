import { Booking } from "./booking.entity";
export declare class BookingCancel {
    id: string;
    date: Date;
    reason: string;
    booking: Booking;
}
