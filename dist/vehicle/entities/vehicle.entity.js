"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const booking_entity_1 = require("../../booking/enities/booking.entity");
const driver_vehicle_entity_1 = require("../../driver/entities/driver.vehicle.entity");
const owner_entity_1 = require("../../owner/entities/owner.entity");
const typeorm_1 = require("typeorm");
let Vehicle = class Vehicle {
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15 }),
    __metadata("design:type", String)
], Vehicle.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15 }),
    __metadata("design:type", String)
], Vehicle.prototype, "regNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 25 }),
    __metadata("design:type", String)
], Vehicle.prototype, "preferredArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], Vehicle.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 15, nullable: false }),
    __metadata("design:type", String)
], Vehicle.prototype, "capacityUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 300 }),
    __metadata("design:type", String)
], Vehicle.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250 }),
    __metadata("design:type", String)
], Vehicle.prototype, "vehicleBookUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "chargePerKm", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "heavyVehicle", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => owner_entity_1.Owner, (owner) => owner.vehicles),
    __metadata("design:type", owner_entity_1.Owner)
], Vehicle.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => driver_vehicle_entity_1.DriverVehicle, (driverVehicle) => driverVehicle.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "driverVehicle", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "booking", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)()
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map