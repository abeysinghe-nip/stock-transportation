import { Driver } from "./driver.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { Owner } from "src/owner/entities/owner.entity";
export declare class DriverVehicle {
    id: string;
    assignedDate: Date;
    removedDate: Date;
    driver: Driver;
    vehicle: Vehicle;
    owner: Owner;
}
