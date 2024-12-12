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
exports.SharedBookingReq = void 0;
const swagger_1 = require("@nestjs/swagger");
class SharedBookingReq {
}
exports.SharedBookingReq = SharedBookingReq;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SharedBookingReq.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SharedBookingReq.prototype, "startLong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SharedBookingReq.prototype, "startLat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SharedBookingReq.prototype, "destLong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SharedBookingReq.prototype, "destLat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SharedBookingReq.prototype, "travellingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SharedBookingReq.prototype, "avgHandlingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SharedBookingReq.prototype, "vehicleCharge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SharedBookingReq.prototype, "serviceCharge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["upcoming, complete"] }),
    __metadata("design:type", String)
], SharedBookingReq.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], SharedBookingReq.prototype, "isCancelled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SharedBookingReq.prototype, "customerId", void 0);
//# sourceMappingURL=sharedBooking.req.js.map