"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const driver_entity_1 = require("./entities/driver.entity");
const driver_service_1 = require("./driver.service");
const driver_controller_1 = require("./driver.controller");
const tempDriver_entity_1 = require("./entities/tempDriver.entity");
const common_module_1 = require("../common/common.module");
const owner_module_1 = require("../owner/owner.module");
const driver_vehicle_entity_1 = require("./entities/driver.vehicle.entity");
const auth_module_1 = require("../auth/auth.module");
const booking_entity_1 = require("../booking/enities/booking.entity");
const sharedBooking_entity_1 = require("../booking/enities/sharedBooking.entity");
const gateways_module_1 = require("../gateways/gateways.module");
const booking_module_1 = require("../booking/booking.module");
const driverNotification_entity_1 = require("./entities/driverNotification.entity");
let DriverModule = class DriverModule {
};
exports.DriverModule = DriverModule;
exports.DriverModule = DriverModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                driver_entity_1.Driver,
                tempDriver_entity_1.TempDriver,
                driver_vehicle_entity_1.DriverVehicle,
                booking_entity_1.Booking,
                sharedBooking_entity_1.SharedBooking,
                driverNotification_entity_1.DriverNotification
            ]),
            (0, common_1.forwardRef)(() => common_module_1.CommonModule),
            (0, common_1.forwardRef)(() => owner_module_1.OwnerModule),
            auth_module_1.AuthModule,
            (0, common_1.forwardRef)(() => gateways_module_1.GatewayModule),
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule)
        ],
        providers: [driver_service_1.DriverService],
        controllers: [driver_controller_1.DriverController],
        exports: [typeorm_1.TypeOrmModule, driver_service_1.DriverService]
    })
], DriverModule);
//# sourceMappingURL=driver.module.js.map