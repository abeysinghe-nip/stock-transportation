import { Owner } from "src/owner/entities/owner.entity";
export declare class TempDriver {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    policeCertiUrl: string;
    licenseUrl: string;
    photoUrl: string;
    heavyVehicleLic: boolean;
    owner: Owner;
}
