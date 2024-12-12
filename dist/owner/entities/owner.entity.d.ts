import { Driver } from "src/driver/entities/driver.entity";
import { DriverVehicle } from "src/driver/entities/driver.vehicle.entity";
import { TempDriver } from "src/driver/entities/tempDriver.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { OwnerRewards } from "./ownerRewards.entity";
import { OwnerNotification } from "./ownerNotification.entity";
import { Chat } from "src/chat/entities/chat.entity";
import { OwnerOtp } from "src/common/entities/ownerOtp.entity";
export declare class Owner {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    nic: string;
    email: string;
    mobNumber: string;
    password: string;
    gsCertiUrl: string;
    profilePic: string;
    tempDrivers: TempDriver[];
    drivers: Driver[];
    vehicles: Vehicle[];
    driverVehicle: DriverVehicle[];
    ownerRewards: OwnerRewards[];
    ownerNotification: OwnerNotification[];
    chat: Chat[];
    ownerOtp: OwnerOtp[];
}
