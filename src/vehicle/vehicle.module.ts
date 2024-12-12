import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleService } from './vehicle.service';
import { TempVehicle } from './entities/tempVehicle.entity';
import { OwnerModule } from 'src/owner/owner.module';
import { DriverVehicle } from 'src/driver/entities/driver.vehicle.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vehicle, TempVehicle, DriverVehicle]), 
        forwardRef(() => OwnerModule)
    ],
    providers: [VehicleService],
    controllers: [],
    exports: [TypeOrmModule, VehicleService]
})
export class VehicleModule {}
