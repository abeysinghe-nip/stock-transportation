"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerModule = void 0;
const common_1 = require("@nestjs/common");
const owner_service_1 = require("./owner.service");
const owner_controller_1 = require("./owner.controller");
const typeorm_1 = require("@nestjs/typeorm");
const owner_entity_1 = require("./entities/owner.entity");
const tempOwner_entity_1 = require("./entities/tempOwner.entity");
const common_module_1 = require("../common/common.module");
const driver_module_1 = require("../driver/driver.module");
const vehicle_module_1 = require("../vehicle/vehicle.module");
const auth_module_1 = require("../auth/auth.module");
const ownerCredit_entity_1 = require("./entities/ownerCredit.entity");
const ownerWallet_entity_1 = require("./entities/ownerWallet.entity");
const booking_module_1 = require("../booking/booking.module");
const ownerDebit_entity_1 = require("./entities/ownerDebit.entity");
const ownerRewards_entity_1 = require("./entities/ownerRewards.entity");
const ownerNotification_entity_1 = require("./entities/ownerNotification.entity");
let OwnerModule = class OwnerModule {
};
exports.OwnerModule = OwnerModule;
exports.OwnerModule = OwnerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                owner_entity_1.Owner,
                tempOwner_entity_1.TempOwner,
                ownerCredit_entity_1.OwnerCredit,
                ownerWallet_entity_1.OwnerWallet,
                ownerDebit_entity_1.OwnerDebit,
                ownerRewards_entity_1.OwnerRewards,
                ownerNotification_entity_1.OwnerNotification
            ]),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            booking_module_1.BookingModule,
            (0, common_1.forwardRef)(() => driver_module_1.DriverModule),
            (0, common_1.forwardRef)(() => vehicle_module_1.VehicleModule),
        ],
        providers: [owner_service_1.OwnerService],
        controllers: [owner_controller_1.OwnerController],
        exports: [typeorm_1.TypeOrmModule]
    })
], OwnerModule);
//# sourceMappingURL=owner.module.js.map