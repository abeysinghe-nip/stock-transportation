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
exports.RateReview = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const customer_entity_1 = require("../../customer/entities/customer.entity");
const driver_entity_1 = require("../../driver/entities/driver.entity");
const sharedBooking_entity_1 = require("./sharedBooking.entity");
let RateReview = class RateReview {
};
exports.RateReview = RateReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RateReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], RateReview.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RateReview.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], RateReview.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => booking_entity_1.Booking, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", booking_entity_1.Booking)
], RateReview.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => sharedBooking_entity_1.SharedBooking, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", sharedBooking_entity_1.SharedBooking)
], RateReview.prototype, "sharedBooking", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.rateReview),
    __metadata("design:type", customer_entity_1.Customer)
], RateReview.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.rateReview),
    __metadata("design:type", driver_entity_1.Driver)
], RateReview.prototype, "driver", void 0);
exports.RateReview = RateReview = __decorate([
    (0, typeorm_1.Entity)()
], RateReview);
//# sourceMappingURL=rateReview.entity.js.map