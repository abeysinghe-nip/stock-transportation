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
exports.OwnerCredit = void 0;
const booking_entity_1 = require("../../booking/enities/booking.entity");
const typeorm_1 = require("typeorm");
const ownerWallet_entity_1 = require("./ownerWallet.entity");
const sharedBooking_entity_1 = require("../../booking/enities/sharedBooking.entity");
let OwnerCredit = class OwnerCredit {
};
exports.OwnerCredit = OwnerCredit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OwnerCredit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], OwnerCredit.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], OwnerCredit.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => booking_entity_1.Booking),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", booking_entity_1.Booking)
], OwnerCredit.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => sharedBooking_entity_1.SharedBooking),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", sharedBooking_entity_1.SharedBooking)
], OwnerCredit.prototype, "sharedBooking", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ownerWallet_entity_1.OwnerWallet, (ownerWallet) => ownerWallet.ownerCredit),
    __metadata("design:type", ownerWallet_entity_1.OwnerWallet)
], OwnerCredit.prototype, "wallet", void 0);
exports.OwnerCredit = OwnerCredit = __decorate([
    (0, typeorm_1.Entity)()
], OwnerCredit);
//# sourceMappingURL=ownerCredit.entity.js.map