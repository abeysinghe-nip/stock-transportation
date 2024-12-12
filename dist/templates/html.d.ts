export declare class HTML {
    private firstName;
    private lastName;
    constructor(firstName: string, lastName: string);
    pendingOwner(): string;
    acceptOwner(): string;
    rejectOwner(): string;
    pendingDriver(firstName: string, lastName: string): string;
    acceptDriver(firstName: string, lastName: string): string;
    acceptDriverToDriver(userName: string, password: string): string;
    rejectDriver(firstName: string, lastName: string): string;
    pendingVehicle(vehicleNo: string): string;
    acceptVehicle(vehicleNo: string): string;
    rejectVehicle(vehicleNo: string): string;
    createCustomer(): string;
    startRide(driverFName: string, driverLName: string, driverPhone: string, bookingId: string): string;
    boookingComplete(bookingId: string, bookingDate: string): string;
    driverAtPickupLoc(bookingId: string, driverFName: string, driverLName: string, driverPhone: string): string;
    driverAtUnloadingLoc(bookingId: string, driverFName: string, driverLName: string, driverPhone: string): string;
    sendOtp(otpCode: string): string;
}
