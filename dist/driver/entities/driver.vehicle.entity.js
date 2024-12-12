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
exports.DriverVehicle = void 0;
const typeorm_1 = require("typeorm");
const driver_entity_1 = require("./driver.entity");
const vehicle_entity_1 = require("../../vehicle/entities/vehicle.entity");
const owner_entity_1 = require("../../owner/entities/owner.entity");
let DriverVehicle = class DriverVehicle {
};
exports.DriverVehicle = DriverVehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DriverVehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DriverVehicle.prototype, "assignedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], DriverVehicle.prototype, "removedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.driverVehicle),
    __metadata("design:type", driver_entity_1.Driver)
], DriverVehicle.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle, (vehicle) => vehicle.driverVehicle),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], DriverVehicle.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => owner_entity_1.Owner, (owner) => owner.driverVehicle),
    __metadata("design:type", owner_entity_1.Owner)
], DriverVehicle.prototype, "owner", void 0);
exports.DriverVehicle = DriverVehicle = __decorate([
    (0, typeorm_1.Entity)()
], DriverVehicle);
//# sourceMappingURL=driver.vehicle.entity.js.map