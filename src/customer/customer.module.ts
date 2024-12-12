import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CommonModule } from 'src/common/common.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { BookingModule } from 'src/booking/booking.module';
import { Booking } from 'src/booking/enities/booking.entity';
import { CustomerRewards } from './entities/customerRewards.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerNotification } from './entities/customerNotification.entity';
import { CustomerFeedback } from 'src/common/entities/customerFeedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Booking,
      CustomerRewards,
      CustomerNotification,
      CustomerFeedback
    ]),
    forwardRef(() => CommonModule),
    VehicleModule,
    forwardRef(() => BookingModule),
    AuthModule
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [TypeOrmModule]
})
export class CustomerModule {}
