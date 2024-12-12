import { Owner } from "src/owner/entities/owner.entity";
import { DriverVehicle } from "./driver.vehicle.entity";
import { BalPayment } from "src/booking/enities/balPayment.entity";
import { RateReview } from "src/booking/enities/rateReview.entity";
import { DriverNotification } from "./driverNotification.entity";
import { DriverOtp } from "src/common/entities/driverOtp.entity";
export declare class Driver {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    password: string;
    policeCertiUrl: string;
    licenseUrl: string;
    photoUrl: string;
    heavyVehicleLic: boolean;
    enabled: boolean;
    deleted: boolean;
    owner: Owner;
    driverVehicle: DriverVehicle[];
    balPayment: BalPayment[];
    rateReview: RateReview[];
    driverNotification: DriverNotification[];
    driverOtp: DriverOtp[];
}
