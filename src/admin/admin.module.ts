import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempOwner } from 'src/owner/entities/tempOwner.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { CommonModule } from 'src/common/common.module';
import { TempDriver } from 'src/driver/entities/tempDriver.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { TempVehicle } from 'src/vehicle/entities/tempVehicle.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Admin } from './entites/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Booking } from 'src/booking/enities/booking.entity';
import { SharedBooking } from 'src/booking/enities/sharedBooking.entity';
import { BookingModule } from 'src/booking/booking.module';
import { CustomerFeedback } from 'src/common/entities/customerFeedback.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TempOwner,
      Owner,
      TempDriver,
      Driver,
      TempVehicle,
      Vehicle, 
      Admin,
      Booking,
      SharedBooking,
      CustomerFeedback,
      Customer
    ]),
    CommonModule,
    AuthModule,
    BookingModule
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [TypeOrmModule]
})
export class AdminModule {}
