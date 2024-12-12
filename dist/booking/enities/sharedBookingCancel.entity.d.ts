import { SharedBooking } from "./sharedBooking.entity";
export declare class SharedBookingCancel {
    id: string;
    date: Date;
    reason: string;
    sharedBooking: SharedBooking;
}
