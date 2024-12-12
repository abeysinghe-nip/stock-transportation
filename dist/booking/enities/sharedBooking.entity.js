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
exports.SharedBooking = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const advancePayment_entity_1 = require("./advancePayment.entity");
const balPayment_entity_1 = require("./balPayment.entity");
const customer_entity_1 = require("../../customer/entities/customer.entity");
let SharedBooking = class SharedBooking {
};
exports.SharedBooking = SharedBooking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SharedBooking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "startLong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "startLat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "destLong", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "destLat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "travellingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "avgHandlingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "loadingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "unloadingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "vehicleCharge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], SharedBooking.prototype, "serviceCharge", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'upcoming' }),
    __metadata("design:type", String)
], SharedBooking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SharedBooking.prototype, "isCancelled", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, (booking) => booking.sharedBooking),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", booking_entity_1.Booking)
], SharedBooking.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => advancePayment_entity_1.AdvancePayment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", advancePayment_entity_1.AdvancePayment)
], SharedBooking.prototype, "advancePayment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => balPayment_entity_1.BalPayment),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", balPayment_entity_1.BalPayment)
], SharedBooking.prototype, "balPayment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.sharedBooking),
    __metadata("design:type", customer_entity_1.Customer)
], SharedBooking.prototype, "customer", void 0);
exports.SharedBooking = SharedBooking = __decorate([
    (0, typeorm_1.Entity)()
], SharedBooking);
//# sourceMappingURL=sharedBooking.entity.js.map