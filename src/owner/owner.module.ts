import { forwardRef, Module } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { TempOwner } from './entities/tempOwner.entity';
import { CommonModule } from 'src/common/common.module';
import { DriverModule } from 'src/driver/driver.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { AuthModule } from 'src/auth/auth.module';
import { OwnerCredit } from './entities/ownerCredit.entity';
import { OwnerWallet } from './entities/ownerWallet.entity';
import { BookingModule } from 'src/booking/booking.module';
import { OwnerDebit } from './entities/ownerDebit.entity';
import { OwnerRewards } from './entities/ownerRewards.entity';
import { OwnerNotification } from './entities/ownerNotification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Owner,
            TempOwner,
            OwnerCredit,
            OwnerWallet,
            OwnerDebit,
            OwnerRewards,
            OwnerNotification
        ]),
        CommonModule,
        AuthModule,
        BookingModule,
        forwardRef(() => DriverModule),
        forwardRef(() => VehicleModule),
    ],
    providers: [OwnerService],
    controllers: [OwnerController],
    exports: [TypeOrmModule]
})
export class OwnerModule {}
