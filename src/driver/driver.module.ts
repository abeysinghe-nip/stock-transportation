import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { TempDriver } from './entities/tempDriver.entity';
import { CommonModule } from 'src/common/common.module';
import { OwnerModule } from 'src/owner/owner.module';
import { DriverVehicle } from './entities/driver.vehicle.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Booking } from 'src/booking/enities/booking.entity';

import { SharedBooking } from 'src/booking/enities/sharedBooking.entity';
import { GatewayModule } from 'src/gateways/gateways.module';
import { BookingModule } from 'src/booking/booking.module';
import { DriverNotification } from './entities/driverNotification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Driver,
            TempDriver,
            DriverVehicle,
            Booking,
            SharedBooking,
            DriverNotification
        ]),
        forwardRef(() => CommonModule),
        forwardRef(() => OwnerModule),
        AuthModule,
        forwardRef(() => GatewayModule),
        forwardRef(() => BookingModule)
    ],
    providers: [DriverService],
    controllers: [DriverController],
    exports: [TypeOrmModule, DriverService]
})
export class DriverModule {}
