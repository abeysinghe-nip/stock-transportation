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
exports.TempOwner = void 0;
const typeorm_1 = require("typeorm");
let TempOwner = class TempOwner {
};
exports.TempOwner = TempOwner;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TempOwner.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, }),
    __metadata("design:type", String)
], TempOwner.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], TempOwner.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250 }),
    __metadata("design:type", String)
], TempOwner.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12, unique: true }),
    __metadata("design:type", String)
], TempOwner.prototype, "nic", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150, unique: true }),
    __metadata("design:type", String)
], TempOwner.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12 }),
    __metadata("design:type", String)
], TempOwner.prototype, "mobNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], TempOwner.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], TempOwner.prototype, "gsCertiUrl", void 0);
exports.TempOwner = TempOwner = __decorate([
    (0, typeorm_1.Entity)()
], TempOwner);
//# sourceMappingURL=tempOwner.entity.js.map