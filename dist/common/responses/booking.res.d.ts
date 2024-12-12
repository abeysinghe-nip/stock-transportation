export declare class BookingRes {
    id: string;
    createdAt: Date;
    bookingDate: Date;
    pickupTime: string;
    loadingTime: number;
    unloadingTime: number;
    startLong: number;
    startLat: number;
    destLong: number;
    destLat: number;
    travellingTime: number;
    vehicleCharge: number;
    serviceCharge: number;
    handlingCharge: number;
    loadingCapacity: number;
    isReturnTrip: boolean;
    willingToShare: boolean;
    avgHandlingTime: number;
    status: string;
    isCancelled: boolean;
    sharedBookingId: string;
}
