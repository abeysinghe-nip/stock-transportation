import { Owner } from "src/owner/entities/owner.entity";
export declare class TempVehicle {
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
    owner: Owner;
}
