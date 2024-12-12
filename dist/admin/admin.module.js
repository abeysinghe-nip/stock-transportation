"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const typeorm_1 = require("@nestjs/typeorm");
const tempOwner_entity_1 = require("../owner/entities/tempOwner.entity");
const owner_entity_1 = require("../owner/entities/owner.entity");
const common_module_1 = require("../common/common.module");
const tempDriver_entity_1 = require("../driver/entities/tempDriver.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
const tempVehicle_entity_1 = require("../vehicle/entities/tempVehicle.entity");
const vehicle_entity_1 = require("../vehicle/entities/vehicle.entity");
const admin_entity_1 = require("./entites/admin.entity");
const auth_module_1 = require("../auth/auth.module");
const booking_entity_1 = require("../booking/enities/booking.entity");
const sharedBooking_entity_1 = require("../booking/enities/sharedBooking.entity");
const booking_module_1 = require("../booking/booking.module");
const customerFeedback_entity_1 = require("../common/entities/customerFeedback.entity");
const customer_entity_1 = require("../customer/entities/customer.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                tempOwner_entity_1.TempOwner,
                owner_entity_1.Owner,
                tempDriver_entity_1.TempDriver,
                driver_entity_1.Driver,
                tempVehicle_entity_1.TempVehicle,
                vehicle_entity_1.Vehicle,
                admin_entity_1.Admin,
                booking_entity_1.Booking,
                sharedBooking_entity_1.SharedBooking,
                customerFeedback_entity_1.CustomerFeedback,
                customer_entity_1.Customer
            ]),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            booking_module_1.BookingModule
        ],
        providers: [admin_service_1.AdminService],
        controllers: [admin_controller_1.AdminController],
        exports: [typeorm_1.TypeOrmModule]
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map