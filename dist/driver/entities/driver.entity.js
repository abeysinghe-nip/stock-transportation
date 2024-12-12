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
exports.Driver = void 0;
const owner_entity_1 = require("../../owner/entities/owner.entity");
const typeorm_1 = require("typeorm");
const driver_vehicle_entity_1 = require("./driver.vehicle.entity");
const balPayment_entity_1 = require("../../booking/enities/balPayment.entity");
const rateReview_entity_1 = require("../../booking/enities/rateReview.entity");
const driverNotification_entity_1 = require("./driverNotification.entity");
const driverOtp_entity_1 = require("../../common/entities/driverOtp.entity");
let Driver = class Driver {
};
exports.Driver = Driver;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Driver.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Driver.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Driver.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12 }),
    __metadata("design:type", String)
], Driver.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, unique: true }),
    __metadata("design:type", String)
], Driver.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250 }),
    __metadata("design:type", String)
], Driver.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Driver.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Driver.prototype, "policeCertiUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Driver.prototype, "licenseUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Driver.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Driver.prototype, "heavyVehicleLic", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Driver.prototype, "enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Driver.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => owner_entity_1.Owner, (owner) => owner),
    __metadata("design:type", owner_entity_1.Owner)
], Driver.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => driver_vehicle_entity_1.DriverVehicle, (driverVehicle) => driverVehicle.driver),
    __metadata("design:type", Array)
], Driver.prototype, "driverVehicle", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => balPayment_entity_1.BalPayment, (balPayment) => balPayment.driver),
    __metadata("design:type", Array)
], Driver.prototype, "balPayment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rateReview_entity_1.RateReview, (rateReview) => rateReview.driver),
    __metadata("design:type", Array)
], Driver.prototype, "rateReview", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => driverNotification_entity_1.DriverNotification, (driverNotification) => driverNotification.driver),
    __metadata("design:type", Array)
], Driver.prototype, "driverNotification", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => driverOtp_entity_1.DriverOtp, (driverOtp) => driverOtp.driver),
    __metadata("design:type", Array)
], Driver.prototype, "driverOtp", void 0);
exports.Driver = Driver = __decorate([
    (0, typeorm_1.Entity)()
], Driver);
//# sourceMappingURL=driver.entity.js.map