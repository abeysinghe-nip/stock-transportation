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
exports.CustomerRewards = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const balPayment_entity_1 = require("../../booking/enities/balPayment.entity");
let CustomerRewards = class CustomerRewards {
};
exports.CustomerRewards = CustomerRewards;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomerRewards.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CustomerRewards.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], CustomerRewards.prototype, "reward", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CustomerRewards.prototype, "isClaimed", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.customerRewards),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerRewards.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => balPayment_entity_1.BalPayment, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", balPayment_entity_1.BalPayment)
], CustomerRewards.prototype, "balPayment", void 0);
exports.CustomerRewards = CustomerRewards = __decorate([
    (0, typeorm_1.Entity)()
], CustomerRewards);
//# sourceMappingURL=customerRewards.entity.js.map