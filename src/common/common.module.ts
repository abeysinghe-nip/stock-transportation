import { forwardRef, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/booking/enities/booking.entity';
import { SharedBooking } from 'src/booking/enities/sharedBooking.entity';
import { BookingModule } from 'src/booking/booking.module';
import { CustomerOtp } from './entities/customerOtp.entity';
import { DriverOtp } from './entities/driverOtp.entity';
import { OwnerOtp } from './entities/ownerOtp.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { CustomerFeedback } from './entities/customerFeedback.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            Booking,
            SharedBooking,
            CustomerOtp,
            DriverOtp,
            OwnerOtp,
            Customer,
            Owner,
            Driver,
            CustomerFeedback
        ]),
        forwardRef(() => BookingModule) 
    ],
    providers: [CommonService],
    controllers: [CommonController],
    exports: [CommonService]
})
export class CommonModule {}
