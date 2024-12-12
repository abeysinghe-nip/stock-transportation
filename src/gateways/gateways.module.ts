import { forwardRef, Module } from "@nestjs/common";
import { TimersGateway } from "./timers.gateway";
import { BookingModule } from "src/booking/booking.module";
import { RideGateway } from "./ride.gateways";
import { NotificationGateway } from "./notification.gateway";
import { CustomerModule } from "src/customer/customer.module";
import { OwnerModule } from "src/owner/owner.module";
import { DriverModule } from "src/driver/driver.module";
import { ChatGateway } from "./chat.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/chat/entities/chat.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Chat
        ]),
        forwardRef(() => BookingModule),
        CustomerModule,
        forwardRef(() => OwnerModule),
        forwardRef(() => DriverModule),
    ],
    providers: [TimersGateway, RideGateway, NotificationGateway, ChatGateway],
    exports: [TimersGateway, RideGateway, NotificationGateway, ChatGateway]
})
export class GatewayModule{}