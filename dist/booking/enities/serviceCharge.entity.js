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
exports.ServiceCharge = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const sharedBooking_entity_1 = require("./sharedBooking.entity");
let ServiceCharge = class ServiceCharge {
};
exports.ServiceCharge = ServiceCharge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ServiceCharge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ServiceCharge.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], ServiceCharge.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'completed' }),
    __metadata("design:type", String)
], ServiceCharge.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => booking_entity_1.Booking),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", booking_entity_1.Booking)
], ServiceCharge.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => sharedBooking_entity_1.SharedBooking),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", sharedBooking_entity_1.SharedBooking)
], ServiceCharge.prototype, "sharedBooking", void 0);
exports.ServiceCharge = ServiceCharge = __decorate([
    (0, typeorm_1.Entity)()
], ServiceCharge);
//# sourceMappingURL=serviceCharge.entity.js.map