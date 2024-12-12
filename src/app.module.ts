import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './test/test.module';
import { OwnerModule } from './owner/owner.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { DriverModule } from './driver/driver.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { GatewayModule } from './gateways/gateways.module';
import { ChatModule } from './chat/chat.module';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_UNAME,
      password: process.env.DB_PW,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TestModule,
    OwnerModule,
    AdminModule,
    CommonModule,
    DriverModule,
    VehicleModule,
    CustomerModule,
    AuthModule,
    BookingModule,
    GatewayModule,
    ChatModule,
  ],
})
export class AppModule {}
