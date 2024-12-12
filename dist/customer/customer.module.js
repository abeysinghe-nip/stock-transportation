"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const customer_service_1 = require("./customer.service");
const customer_controller_1 = require("./customer.controller");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const common_module_1 = require("../common/common.module");
const vehicle_module_1 = require("../vehicle/vehicle.module");
const booking_module_1 = require("../booking/booking.module");
const booking_entity_1 = require("../booking/enities/booking.entity");
const customerRewards_entity_1 = require("./entities/customerRewards.entity");
const auth_module_1 = require("../auth/auth.module");
const customerNotification_entity_1 = require("./entities/customerNotification.entity");
const customerFeedback_entity_1 = require("../common/entities/customerFeedback.entity");
let CustomerModule = class CustomerModule {
};
exports.CustomerModule = CustomerModule;
exports.CustomerModule = CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                customer_entity_1.Customer,
                booking_entity_1.Booking,
                customerRewards_entity_1.CustomerRewards,
                customerNotification_entity_1.CustomerNotification,
                customerFeedback_entity_1.CustomerFeedback
            ]),
            (0, common_1.forwardRef)(() => common_module_1.CommonModule),
            vehicle_module_1.VehicleModule,
            (0, common_1.forwardRef)(() => booking_module_1.BookingModule),
            auth_module_1.AuthModule
        ],
        providers: [customer_service_1.CustomerService],
        controllers: [customer_controller_1.CustomerController],
        exports: [typeorm_1.TypeOrmModule]
    })
], CustomerModule);
//# sourceMappingURL=customer.module.js.map