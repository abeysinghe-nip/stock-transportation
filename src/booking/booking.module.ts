import { forwardRef, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './enities/booking.entity';
import { DriverVehicle } from 'src/driver/entities/driver.vehicle.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { AdvancePayment } from './enities/advancePayment.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { BookingCancel } from './enities/bookingCancel.entity';
import { OwnerCredit } from 'src/owner/entities/ownerCredit.entity';
import { OwnerWallet } from 'src/owner/entities/ownerWallet.entity';
import { BalPayment } from './enities/balPayment.entity';
import { SharedBooking } from './enities/sharedBooking.entity';
import { SharedBookingCancel } from './enities/sharedBookingCancel.entity';
import { ServiceCharge } from './enities/serviceCharge.entity';
import { RateReview } from './enities/rateReview.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { CustomerModule } from 'src/customer/customer.module';
import { OwnerModule } from 'src/owner/owner.module';
import { GatewayModule } from 'src/gateways/gateways.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      DriverVehicle,
      Customer,
      AdvancePayment,
      Vehicle,
      BookingCancel,
      OwnerCredit,
      OwnerWallet,
      BalPayment,
      SharedBooking,
      SharedBookingCancel,
      ServiceCharge,
      RateReview,
      Driver
    ]),
    forwardRef(() => CustomerModule),
    forwardRef(() => OwnerModule),
    GatewayModule
  ],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule {}
