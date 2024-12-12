import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TempVehicle } from './entities/tempVehicle.entity';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { VehicleDto } from './dtos/vehicle.dto';
import { DriverVehicle } from 'src/driver/entities/driver.vehicle.entity';

@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(TempVehicle) private tempVehicleRepo: Repository<TempVehicle>,
        @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
        @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
        @InjectRepository(DriverVehicle) private driverVehicleRepo: Repository<DriverVehicle>,
    ){}

    //create vehicle
    async createVehicle(vehicleDto: VehicleDto): Promise<TempVehicle> {
        const owner = await this.ownerRepo.findOne({where: {id: vehicleDto.ownerId}});

        const vehicle: TempVehicle = new TempVehicle();

        vehicle.capacity = vehicleDto.capacity;
        vehicle.capacityUnit = vehicleDto.capacityUnit;
        vehicle.owner = owner;
        vehicle.photoUrl = vehicleDto.photoUrl;
        vehicle.preferredArea = vehicleDto.preferredArea;
        vehicle.regNo = vehicleDto.regNo;
        vehicle.type = vehicleDto.type;
        vehicle.vehicleBookUrl = vehicleDto.vehicleBookUrl;
        vehicle.chargePerKm = vehicleDto.chargePerKm;
        vehicle.heavyVehicle = vehicleDto.heavyVehicle;

        return await this.tempVehicleRepo.save(vehicle);
    }

    //get all drivers assigned vehicles
    async getAllVehicles(): Promise<Vehicle[]> {
        const vehicles: Vehicle[] = [];
        const driverVehicles = await this.driverVehicleRepo.createQueryBuilder("DriverVehi")
            .leftJoinAndSelect("DriverVehi.vehicle", "vehicle")
            .where("DriverVehi.removedDate IS NULL")
            .getMany()

        if(driverVehicles.length !== 0) {
            for(const driverVehicle of driverVehicles) {
                vehicles.push(driverVehicle.vehicle);
            }
        }
        return vehicles;
    }
}
