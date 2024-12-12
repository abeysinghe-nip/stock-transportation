import { Booking } from "src/booking/enities/booking.entity";
import { OwnerWallet } from "./ownerWallet.entity";
import { SharedBooking } from "src/booking/enities/sharedBooking.entity";
export declare class OwnerCredit {
    id: string;
    date: Date;
    amount: number;
    booking: Booking;
    sharedBooking: SharedBooking;
    wallet: OwnerWallet;
}
