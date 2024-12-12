import { Booking } from "./booking.entity";
import { AdvancePayment } from "./advancePayment.entity";
import { BalPayment } from "./balPayment.entity";
import { Customer } from "src/customer/entities/customer.entity";
export declare class SharedBooking {
    id: string;
    startLong: number;
    startLat: number;
    destLong: number;
    destLat: number;
    travellingTime: number;
    avgHandlingTime: number;
    loadingTime: number;
    unloadingTime: number;
    vehicleCharge: number;
    serviceCharge: number;
    status: string;
    isCancelled: boolean;
    booking: Booking;
    advancePayment: AdvancePayment;
    balPayment: BalPayment;
    customer: Customer;
}
