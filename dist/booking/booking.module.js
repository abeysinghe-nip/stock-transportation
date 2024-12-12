"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./enities/booking.entity");
const driver_vehicle_entity_1 = require("../driver/entities/driver.vehicle.entity");
const customer_entity_1 = require("../customer/entities/customer.entity");
const advancePayment_entity_1 = require("./enities/advancePayment.entity");
const vehicle_entity_1 = require("../vehicle/entities/vehicle.entity");
const bookingCancel_entity_1 = require("./enities/bookingCancel.entity");
const ownerCredit_entity_1 = require("../owner/entities/ownerCredit.entity");
const ownerWallet_entity_1 = require("../owner/entities/ownerWallet.entity");
const balPayment_entity_1 = require("./enities/balPayment.entity");
const sharedBooking_entity_1 = require("./enities/sharedBooking.entity");
const sharedBookingCancel_entity_1 = require("./enities/sharedBookingCancel.entity");
const serviceCharge_entity_1 = require("./enities/serviceCharge.entity");
const rateReview_entity_1 = require("./enities/rateReview.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
const customer_module_1 = require("../customer/customer.module");
const owner_module_1 = require("../owner/owner.module");
const gateways_module_1 = require("../gateways/gateways.module");
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                booking_entity_1.Booking,
                driver_vehicle_entity_1.DriverVehicle,
                customer_entity_1.Customer,
                advancePayment_entity_1.AdvancePayment,
                vehicle_entity_1.Vehicle,
                bookingCancel_entity_1.BookingCancel,
                ownerCredit_entity_1.OwnerCredit,
                ownerWallet_entity_1.OwnerWallet,
                balPayment_entity_1.BalPayment,
                sharedBooking_entity_1.SharedBooking,
                sharedBookingCancel_entity_1.SharedBookingCancel,
                serviceCharge_entity_1.ServiceCharge,
                rateReview_entity_1.RateReview,
                driver_entity_1.Driver
            ]),
            (0, common_1.forwardRef)(() => customer_module_1.CustomerModule),
            (0, common_1.forwardRef)(() => owner_module_1.OwnerModule),
            gateways_module_1.GatewayModule
        ],
        providers: [booking_service_1.BookingService],
        exports: [booking_service_1.BookingService]
    })
], BookingModule);
//# sourceMappingURL=booking.module.js.map