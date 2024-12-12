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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const bookingComplete_res_1 = require("../driver/responses/bookingComplete.res");
const common_service_1 = require("./common.service");
const booking_service_1 = require("../booking/booking.service");
const owner_res_1 = require("./responses/owner.res");
const driver_res_1 = require("./responses/driver.res");
const customer_res_1 = require("./responses/customer.res");
const rateReview_res_1 = require("./responses/rateReview.res");
const vehicle_res_1 = require("./responses/vehicle.res");
const cancelledReason_res_1 = require("./responses/cancelledReason.res");
const common_res_1 = require("./responses/common.res");
const html_1 = require("../templates/html");
const otp_req_1 = require("./requests/otp.req");
const password_req_1 = require("./requests/password.req");
const feedback_res_1 = require("../customer/responses/feedback.res");
let CommonController = class CommonController {
    constructor(commonService, bookingService) {
        this.commonService = commonService;
        this.bookingService = bookingService;
    }
    async getPaymentSummery(id, bookingType, res) {
        try {
            if (bookingType === 'original' || bookingType === 'shared') {
                const resp = await this.commonService.calPaymentSummery(id, bookingType);
                return res.status(common_1.HttpStatus.OK).json(resp);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getOwnersData(bookingId, type, res) {
        try {
            if (type === 'original' || type === 'shared') {
                const owner = await this.bookingService.getOwner(bookingId, type);
                const ownerRes = new owner_res_1.OwnerRes();
                ownerRes.id = owner.id;
                ownerRes.firstName = owner.firstName;
                ownerRes.lastName = owner.lastName;
                ownerRes.address = owner.address;
                ownerRes.email = owner.email;
                owner.mobNumber = owner.mobNumber;
                return res.status(common_1.HttpStatus.OK).json(ownerRes);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getUpcomingDriver(bookingId, type, res) {
        try {
            if (type === 'original' || type === 'shared') {
                const driver = await this.bookingService.getUpcomingDriver(bookingId, type);
                const driverRes = new driver_res_1.DriverRes();
                driverRes.id = driver.id;
                driverRes.firstName = driver.firstName;
                driverRes.lastName = driver.lastName;
                driverRes.email = driver.email;
                driverRes.mobNumber = driver.phoneNumber;
                driverRes.address = driver.address;
                driverRes.heavyVehicle = driver.heavyVehicleLic;
                return res.status(common_1.HttpStatus.OK).json(driverRes);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getCompletedDriver(bookingId, type, res) {
        try {
            if (type === 'original' || type === 'shared') {
                const driver = await this.bookingService.getCompletedDriver(bookingId, type);
                const driverRes = new driver_res_1.DriverRes();
                driverRes.id = driver.id;
                driverRes.firstName = driver.firstName;
                driverRes.lastName = driver.lastName;
                driverRes.email = driver.email;
                driverRes.mobNumber = driver.phoneNumber;
                driverRes.address = driver.address;
                driverRes.heavyVehicle = driver.heavyVehicleLic;
                return res.status(common_1.HttpStatus.OK).json(driverRes);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getCustomer(bookingId, type, res) {
        try {
            if (type === 'original' || type === 'shared') {
                const customer = await this.bookingService.getCustomer(bookingId, type);
                const customerRes = new customer_res_1.CustomerRes();
                customerRes.id = customer.id;
                customerRes.firstName = customer.firstName;
                customer.lastName = customer.lastName;
                customerRes.email = customer.email;
                customerRes.address = customer.address;
                customerRes.gender = customer.gender;
                customerRes.mobNumber = customer.mobileNum;
                return res.status(common_1.HttpStatus.OK).json(customerRes);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getRateReview(bookingId, type, res) {
        try {
            if (type === 'original' || type === 'shared') {
                const rate = await this.bookingService.getRateReview(bookingId, type);
                if (rate) {
                    const rateReviewRes = new rateReview_res_1.RateReviewRes();
                    rateReviewRes.id = rate.id;
                    rateReviewRes.rate = rate.rate;
                    rateReviewRes.review = rate.review;
                    return res.status(common_1.HttpStatus.OK).json(rateReviewRes);
                }
                return res.status(common_1.HttpStatus.NOT_FOUND).json("Rate and review not posted");
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getVehicle(bookingId, type, res) {
        try {
            if (type === 'original' || type === 'shared') {
                const vehicle = await this.bookingService.getVehicle(bookingId, type);
                const vehicleRes = new vehicle_res_1.VehicleRes();
                vehicleRes.id = vehicle.id;
                vehicleRes.type = vehicle.type;
                vehicleRes.regNo = vehicle.regNo;
                vehicleRes.preferredArea = vehicle.preferredArea;
                vehicleRes.capacity = vehicle.capacity;
                vehicleRes.capacityUnit = vehicle.capacityUnit;
                vehicleRes.photoUrl = vehicle.photoUrl;
                vehicleRes.chargePerKm = vehicle.chargePerKm;
                vehicleRes.heavyVehicle = vehicle.heavyVehicle;
                return res.status(common_1.HttpStatus.OK).json(vehicleRes);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getCancelledReasin(bookingId, type, res) {
        try {
            if (type === 'original' || type === 'shared') {
                const resp = await this.bookingService.getCancelledReason(bookingId, type);
                return res.status(common_1.HttpStatus.OK).json(resp);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getBookingData(bookingId, type, res) {
        try {
            if (type === 'original' || type === 'shared') {
                const resp = await this.bookingService.getBookingData(bookingId, type);
                return res.status(common_1.HttpStatus.OK).json(resp);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async sendEmailOtp(userEmail, userType, res) {
        try {
            if (userType === 'customer' || userType === 'driver' || userType === 'owner') {
                const resp = await this.commonService.genarateOtp(userEmail, userType);
                const html = new html_1.HTML(resp.firstName, resp.lastName);
                const message = html.sendOtp(resp.otp);
                await this.commonService.sendNotifications(resp.email, 'Your Gulf Transportation Solution OTP Code!', message);
                const commonRes = new common_res_1.CommonRes();
                commonRes.id = resp.id;
                return res.status(common_1.HttpStatus.OK).json(commonRes);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid user type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async verifyOtp(otp, userId, userType, res) {
        try {
            if (userType === 'customer' || userType === 'driver' || userType === 'owner') {
                await this.commonService.verifyOtp(userType, userId, otp, res);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid user type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async changePassword(userId, userType, password, res) {
        try {
            if (userType === 'customer' || userType === 'driver' || userType === 'owner') {
                const resp = await this.commonService.changePassword(userId, userType, password);
                const commonRes = new common_res_1.CommonRes();
                commonRes.id = resp.id;
                return res.status(common_1.HttpStatus.OK).json(commonRes);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid user type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
    async getFeedbacks(res) {
        try {
            const response = [];
            const resp = await this.commonService.getFeedbacks();
            if (resp.length !== 0) {
                for (const f of resp) {
                    const obj = new feedback_res_1.FeedbackRes();
                    obj.id = f.id;
                    obj.createdAt = f.createdAt;
                    obj.customerName = f.customer.firstName + ' ' + f.customer.lastName;
                    obj.photoUrl = f.customer.profilePic;
                    obj.feedback = f.feedback;
                    response.push(obj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
};
exports.CommonController = CommonController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('paymentSummery/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Payment summery", type: bookingComplete_res_1.BookingCompleteRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get payment summery of the unloaded bookings" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getPaymentSummery", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('owner/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Owner data", type: owner_res_1.OwnerRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get owner's data by booking id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getOwnersData", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('upcomingDriver/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Driver data", type: driver_res_1.DriverRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get drivers's data by upcoming booking id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getUpcomingDriver", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('completedDriver/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Driver data", type: driver_res_1.DriverRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get drivers's data by completed booking id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getCompletedDriver", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('customer/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Customer data", type: customer_res_1.CustomerRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get customer's data by booking id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getCustomer", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('rates/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Rates and review", type: rateReview_res_1.RateReviewRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Rate and review not posted" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get rates and review by booking id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getRateReview", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('vehicle/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Vehicle date", type: vehicle_res_1.VehicleRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get vehicle by booking id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getVehicle", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('cancelledReason/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Cancelled reason", type: cancelledReason_res_1.CancelledReasonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get cancelled reason by booking id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getCancelledReasin", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('booking/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Booking data" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get booking data by booking id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getBookingData", null);
__decorate([
    (0, common_1.Post)('otp/:email'),
    (0, swagger_1.ApiParam)({
        name: 'email',
        required: true,
        type: String,
        description: 'user email'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'userType',
        required: true,
        type: String,
        description: 'user type',
        enum: ['customer', 'driver', 'owner']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "User ID", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "send email otp for forgot password" }),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Query)('userType')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "sendEmailOtp", null);
__decorate([
    (0, common_1.Post)('verifyOtp/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'user Id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'userType',
        required: true,
        type: String,
        description: 'user type',
        enum: ['customer', 'driver', 'owner']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "OTP verified" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Invalid OTP" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.FORBIDDEN, description: "OTP expired" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "verify otp" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('userType')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_req_1.OtpReq, String, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Put)('changePassword/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'user Id'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'userType',
        required: true,
        type: String,
        description: 'user type',
        enum: ['customer', 'driver', 'owner']
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "ID of updated user", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "change forgot password" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userType')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, password_req_1.Password, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('feedbacks'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of approved feedbacks", type: [feedback_res_1.FeedbackRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the approved feedbacks" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getFeedbacks", null);
exports.CommonController = CommonController = __decorate([
    (0, swagger_1.ApiTags)('common'),
    (0, common_1.Controller)('common'),
    __metadata("design:paramtypes", [common_service_1.CommonService,
        booking_service_1.BookingService])
], CommonController);
//# sourceMappingURL=common.controller.js.map