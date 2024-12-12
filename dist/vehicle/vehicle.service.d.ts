import { TempVehicle } from './entities/tempVehicle.entity';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { VehicleDto } from './dtos/vehicle.dto';
import { DriverVehicle } from 'src/driver/entities/driver.vehicle.entity';
export declare class VehicleService {
    private tempVehicleRepo;
    private vehicleRepo;
    private ownerRepo;
    private driverVehicleRepo;
    constructor(tempVehicleRepo: Repository<TempVehicle>, vehicleRepo: Repository<Vehicle>, ownerRepo: Repository<Owner>, driverVehicleRepo: Repository<DriverVehicle>);
    createVehicle(vehicleDto: VehicleDto): Promise<TempVehicle>;
    getAllVehicles(): Promise<Vehicle[]>;
}
