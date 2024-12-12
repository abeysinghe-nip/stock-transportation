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
exports.Customer = void 0;
const booking_entity_1 = require("../../booking/enities/booking.entity");
const rateReview_entity_1 = require("../../booking/enities/rateReview.entity");
const sharedBooking_entity_1 = require("../../booking/enities/sharedBooking.entity");
const typeorm_1 = require("typeorm");
const customerRewards_entity_1 = require("./customerRewards.entity");
const customerNotification_entity_1 = require("./customerNotification.entity");
const chat_entity_1 = require("../../chat/entities/chat.entity");
const customerOtp_entity_1 = require("../../common/entities/customerOtp.entity");
const customerFeedback_entity_1 = require("../../common/entities/customerFeedback.entity");
let Customer = class Customer {
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250 }),
    __metadata("design:type", String)
], Customer.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "nic", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 6 }),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "mobileNum", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Customer.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "profilePic", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.customer),
    __metadata("design:type", Array)
], Customer.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sharedBooking_entity_1.SharedBooking, (sharedBooking) => sharedBooking.customer),
    __metadata("design:type", sharedBooking_entity_1.SharedBooking)
], Customer.prototype, "sharedBooking", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rateReview_entity_1.RateReview, (rateReview) => rateReview.review),
    __metadata("design:type", Array)
], Customer.prototype, "rateReview", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customerRewards_entity_1.CustomerRewards, (customerRewards) => customerRewards.customer),
    __metadata("design:type", Array)
], Customer.prototype, "customerRewards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customerNotification_entity_1.CustomerNotification, (customerNotification) => customerNotification.customer),
    __metadata("design:type", Array)
], Customer.prototype, "customerNotification", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chat, (chat) => chat.customer),
    __metadata("design:type", Array)
], Customer.prototype, "chat", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customerOtp_entity_1.CustomerOtp, (customerOtp) => customerOtp.customer),
    __metadata("design:type", Array)
], Customer.prototype, "customerOtp", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customerFeedback_entity_1.CustomerFeedback, (customerFeedback) => customerFeedback.customer),
    __metadata("design:type", Array)
], Customer.prototype, "customerFeedBack", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)()
], Customer);
//# sourceMappingURL=customer.entity.js.map