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
exports.OwnerWallet = void 0;
const typeorm_1 = require("typeorm");
const owner_entity_1 = require("./owner.entity");
const ownerCredit_entity_1 = require("./ownerCredit.entity");
const ownerDebit_entity_1 = require("./ownerDebit.entity");
let OwnerWallet = class OwnerWallet {
};
exports.OwnerWallet = OwnerWallet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OwnerWallet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], OwnerWallet.prototype, "earnings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], OwnerWallet.prototype, "withdrawals", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OwnerWallet.prototype, "holderName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OwnerWallet.prototype, "bank", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OwnerWallet.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OwnerWallet.prototype, "accNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 300, nullable: true }),
    __metadata("design:type", String)
], OwnerWallet.prototype, "dwollaUrl", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => owner_entity_1.Owner),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", owner_entity_1.Owner)
], OwnerWallet.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ownerCredit_entity_1.OwnerCredit, (ownerCredit) => ownerCredit.wallet),
    __metadata("design:type", Array)
], OwnerWallet.prototype, "ownerCredit", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ownerDebit_entity_1.OwnerDebit, (ownerDebit) => ownerDebit.wallet),
    __metadata("design:type", Array)
], OwnerWallet.prototype, "ownerDebit", void 0);
exports.OwnerWallet = OwnerWallet = __decorate([
    (0, typeorm_1.Entity)()
], OwnerWallet);
//# sourceMappingURL=ownerWallet.entity.js.map