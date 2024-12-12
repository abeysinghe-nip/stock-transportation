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
exports.OwnerDebit = void 0;
const typeorm_1 = require("typeorm");
const ownerWallet_entity_1 = require("./ownerWallet.entity");
let OwnerDebit = class OwnerDebit {
};
exports.OwnerDebit = OwnerDebit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OwnerDebit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], OwnerDebit.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], OwnerDebit.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ownerWallet_entity_1.OwnerWallet, (ownerWallet) => ownerWallet.ownerDebit),
    __metadata("design:type", ownerWallet_entity_1.OwnerWallet)
], OwnerDebit.prototype, "wallet", void 0);
exports.OwnerDebit = OwnerDebit = __decorate([
    (0, typeorm_1.Entity)()
], OwnerDebit);
//# sourceMappingURL=ownerDebit.entity.js.map