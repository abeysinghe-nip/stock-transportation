import { Booking } from "src/booking/enities/booking.entity";
import { DriverVehicle } from "src/driver/entities/driver.vehicle.entity";
import { Owner } from "src/owner/entities/owner.entity";
export declare class Vehicle {
    id: string;
    type: string;
    regNo: string;
    preferredArea: string;
    capacity: number;
    capacityUnit: string;
    photoUrl: string;
    vehicleBookUrl: string;
    chargePerKm: number;
    heavyVehicle: boolean;
    enabled: boolean;
    deleted: boolean;
    owner: Owner;
    driverVehicle: DriverVehicle[];
    booking: Booking[];
}
