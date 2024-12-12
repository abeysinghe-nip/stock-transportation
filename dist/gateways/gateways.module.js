"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const timers_gateway_1 = require("./timers.gateway");
const booking_module_1 = require("../booking/booking.module");
const ride_gateways_1 = require("./ride.gateways");
const notification_gateway_1 = require("./notification.gateway");
const customer_module_1 = require("../customer/customer.module");
const owner_module_1 = require("../owner/owner.module");
const driver_module_1 = require("../driver/driver.module");
const chat_gateway_1 = require("./chat.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("../chat/entities/chat.entity");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                chat_entity_1.Chat
            ]),
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule),
            customer_module_1.CustomerModule,
            (0, common_1.forwardRef)(() => owner_module_1.OwnerModule),
            (0, common_1.forwardRef)(() => driver_module_1.DriverModule),
        ],
        providers: [timers_gateway_1.TimersGateway, ride_gateways_1.RideGateway, notification_gateway_1.NotificationGateway, chat_gateway_1.ChatGateway],
        exports: [timers_gateway_1.TimersGateway, ride_gateways_1.RideGateway, notification_gateway_1.NotificationGateway, chat_gateway_1.ChatGateway]
    })
], GatewayModule);
//# sourceMappingURL=gateways.module.js.map