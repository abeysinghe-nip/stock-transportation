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
exports.Owner = void 0;
const driver_entity_1 = require("../../driver/entities/driver.entity");
const driver_vehicle_entity_1 = require("../../driver/entities/driver.vehicle.entity");
const tempDriver_entity_1 = require("../../driver/entities/tempDriver.entity");
const vehicle_entity_1 = require("../../vehicle/entities/vehicle.entity");
const typeorm_1 = require("typeorm");
const ownerRewards_entity_1 = require("./ownerRewards.entity");
const ownerNotification_entity_1 = require("./ownerNotification.entity");
const chat_entity_1 = require("../../chat/entities/chat.entity");
const ownerOtp_entity_1 = require("../../common/entities/ownerOtp.entity");
let Owner = class Owner {
};
exports.Owner = Owner;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Owner.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, }),
    __metadata("design:type", String)
], Owner.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Owner.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250 }),
    __metadata("design:type", String)
], Owner.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12, unique: true }),
    __metadata("design:type", String)
], Owner.prototype, "nic", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, unique: true }),
    __metadata("design:type", String)
], Owner.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12 }),
    __metadata("design:type", String)
], Owner.prototype, "mobNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Owner.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Owner.prototype, "gsCertiUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "profilePic", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tempDriver_entity_1.TempDriver, (tempDriver) => tempDriver.owner),
    __metadata("design:type", Array)
], Owner.prototype, "tempDrivers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => driver_entity_1.Driver, (driver) => driver.owner),
    __metadata("design:type", Array)
], Owner.prototype, "drivers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vehicle_entity_1.Vehicle, (vehicle) => vehicle.owner),
    __metadata("design:type", Array)
], Owner.prototype, "vehicles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => driver_vehicle_entity_1.DriverVehicle, (driverVehicle) => driverVehicle.owner),
    __metadata("design:type", Array)
], Owner.prototype, "driverVehicle", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ownerRewards_entity_1.OwnerRewards, (ownerRewards) => ownerRewards.owner),
    __metadata("design:type", Array)
], Owner.prototype, "ownerRewards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ownerNotification_entity_1.OwnerNotification, (ownerNotification) => ownerNotification),
    __metadata("design:type", Array)
], Owner.prototype, "ownerNotification", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chat, (chat) => chat.owner),
    __metadata("design:type", Array)
], Owner.prototype, "chat", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ownerOtp_entity_1.OwnerOtp, (ownerOtp) => ownerOtp.owner),
    __metadata("design:type", Array)
], Owner.prototype, "ownerOtp", void 0);
exports.Owner = Owner = __decorate([
    (0, typeorm_1.Entity)()
], Owner);
//# sourceMappingURL=owner.entity.js.map