"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const test_module_1 = require("./test/test.module");
const owner_module_1 = require("./owner/owner.module");
const admin_module_1 = require("./admin/admin.module");
const common_module_1 = require("./common/common.module");
const driver_module_1 = require("./driver/driver.module");
const vehicle_module_1 = require("./vehicle/vehicle.module");
const customer_module_1 = require("./customer/customer.module");
const auth_module_1 = require("./auth/auth.module");
const booking_module_1 = require("./booking/booking.module");
const gateways_module_1 = require("./gateways/gateways.module");
const chat_module_1 = require("./chat/chat.module");
require('dotenv').config();
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_UNAME,
                password: process.env.DB_PW,
                database: process.env.DATABASE,
                autoLoadEntities: true,
                synchronize: false,
            }),
            test_module_1.TestModule,
            owner_module_1.OwnerModule,
            admin_module_1.AdminModule,
            common_module_1.CommonModule,
            driver_module_1.DriverModule,
            vehicle_module_1.VehicleModule,
            customer_module_1.CustomerModule,
            auth_module_1.AuthModule,
            booking_module_1.BookingModule,
            gateways_module_1.GatewayModule,
            chat_module_1.ChatModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map