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
exports.OwnerRewards = void 0;
const typeorm_1 = require("typeorm");
const owner_entity_1 = require("./owner.entity");
const ownerDebit_entity_1 = require("./ownerDebit.entity");
let OwnerRewards = class OwnerRewards {
};
exports.OwnerRewards = OwnerRewards;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OwnerRewards.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], OwnerRewards.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OwnerRewards.prototype, "rewardAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], OwnerRewards.prototype, "isClaimed", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => owner_entity_1.Owner, (owner) => owner.ownerRewards),
    __metadata("design:type", owner_entity_1.Owner)
], OwnerRewards.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ownerDebit_entity_1.OwnerDebit, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", ownerDebit_entity_1.OwnerDebit)
], OwnerRewards.prototype, "ownerDebit", void 0);
exports.OwnerRewards = OwnerRewards = __decorate([
    (0, typeorm_1.Entity)()
], OwnerRewards);
//# sourceMappingURL=ownerRewards.entity.js.map