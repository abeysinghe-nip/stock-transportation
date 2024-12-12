"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const common_service_1 = require("./common.service");
const common_controller_1 = require("./common.controller");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("../booking/enities/booking.entity");
const sharedBooking_entity_1 = require("../booking/enities/sharedBooking.entity");
const booking_module_1 = require("../booking/booking.module");
const customerOtp_entity_1 = require("./entities/customerOtp.entity");
const driverOtp_entity_1 = require("./entities/driverOtp.entity");
const ownerOtp_entity_1 = require("./entities/ownerOtp.entity");
const customer_entity_1 = require("../customer/entities/customer.entity");
const owner_entity_1 = require("../owner/entities/owner.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
const customerFeedback_entity_1 = require("./entities/customerFeedback.entity");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                booking_entity_1.Booking,
                sharedBooking_entity_1.SharedBooking,
                customerOtp_entity_1.CustomerOtp,
                driverOtp_entity_1.DriverOtp,
                ownerOtp_entity_1.OwnerOtp,
                customer_entity_1.Customer,
                owner_entity_1.Owner,
                driver_entity_1.Driver,
                customerFeedback_entity_1.CustomerFeedback
            ]),
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule)
        ],
        providers: [common_service_1.CommonService],
        controllers: [common_controller_1.CommonController],
        exports: [common_service_1.CommonService]
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map