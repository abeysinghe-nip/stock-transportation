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
exports.DriverController = void 0;
const common_1 = require("@nestjs/common");
const driver_service_1 = require("./driver.service");
const swagger_1 = require("@nestjs/swagger");
const common_service_1 = require("../common/common.service");
const signIn_dto_1 = require("../common/requests/signIn.dto");
const signin_res_1 = require("../common/responses/signin.res");
const auth_service_1 = require("../auth/auth.service");
const auth_guard_1 = require("../auth/auth.guard");
const timer_req_1 = require("./requests/timer.req");
const timers_gateway_1 = require("../gateways/timers.gateway");
const bookingComplete_res_1 = require("./responses/bookingComplete.res");
const booking_service_1 = require("../booking/booking.service");
const coordinates_res_1 = require("./responses/coordinates.res");
const rideStart_req_1 = require("./requests/rideStart.req");
const html_1 = require("../templates/html");
const sendCoord_req_1 = require("./requests/sendCoord.req");
const ride_gateways_1 = require("../gateways/ride.gateways");
const rideStop_req_1 = require("./requests/rideStop.req");
const changePassword_req_1 = require("../common/requests/changePassword.req");
const profile_res_1 = require("./responses/profile.res");
const updateProfile_req_1 = require("../common/requests/updateProfile.req");
const common_res_1 = require("../common/responses/common.res");
const notification_res_1 = require("../common/responses/notification.res");
let DriverController = class DriverController {
    constructor(driverService, commonService, authService, timersGateway, bookingService, riderGateway) {
        this.driverService = driverService;
        this.commonService = commonService;
        this.authService = authService;
        this.timersGateway = timersGateway;
        this.bookingService = bookingService;
        this.riderGateway = riderGateway;
    }
    async emailAvailability(email, res) {
        try {
            const resp = await this.driverService.emailAvilability(email);
            if (resp) {
                return res.status(common_1.HttpStatus.CONFLICT).json("Email exist");
            }
            return res.status(common_1.HttpStatus.OK).json("Email not found");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async signin(signinDto, res) {
        try {
            const driver = await this.driverService.signin(signinDto.userName);
            if (driver) {
                const isMatched = await this.commonService.passwordDecrypt(driver.password, signinDto.password);
                if (isMatched) {
                    const access_token = await this.authService.signin(driver.id, driver.email);
                    return res.status(common_1.HttpStatus.OK).json(access_token);
                }
                return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Mismatched");
            }
            return res.status(common_1.HttpStatus.NOT_FOUND).json("Driver not found");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getAssignVehicle(id, res) {
        try {
            const vehicle = await this.driverService.getAssignedVehicle(id);
            if (!vehicle)
                return res.status(common_1.HttpStatus.NOT_FOUND).json("No any assign vehicle");
            const resp = {};
            resp.id = vehicle.id;
            resp.type = vehicle.type;
            resp.regNo = vehicle.regNo;
            resp.preferredArea = vehicle.preferredArea;
            resp.capacity = vehicle.capacity;
            resp.capacityUnit = vehicle.capacityUnit;
            resp.photoUrl = vehicle.photoUrl;
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getBookings(id, res) {
        try {
            const response = [];
            const vehicle = await this.driverService.getAssignedVehicle(id);
            if (vehicle) {
                const bookings = await this.driverService.getBookings(vehicle);
                if (bookings.length !== 0) {
                    for (const booking of bookings) {
                        const book = {};
                        book.id = booking.id;
                        book.bookingDate = booking.bookingDate;
                        book.pickupTime = booking.pickupTime;
                        book.startLong = booking.startLong;
                        book.startLat = booking.startLat;
                        book.destLong = booking.destLong;
                        book.destLat = booking.destLat;
                        book.loadingTime = booking.loadingTime;
                        book.unloadingTime = booking.unloadingTime;
                        book.travellingTime = booking.travellingTime;
                        book.loadingCapacity = booking.loadingCapacity;
                        book.isReturnTrip = booking.isReturnTrip;
                        book.willingToShare = booking.willingToShare;
                        book.type = "original";
                        response.push(book);
                    }
                }
                const sBookings = await this.driverService.getSharedBookings(vehicle);
                if (sBookings.length !== 0) {
                    for (const booking of sBookings) {
                        const book = {};
                        book.id = booking.id;
                        book.bookingDate = booking.booking.bookingDate;
                        book.pickupTime = booking.booking.pickupTime;
                        book.startLong = booking.startLong;
                        book.startLat = booking.startLat;
                        book.destLong = booking.destLong;
                        book.destLat = booking.destLat;
                        book.loadingTime = booking.loadingTime;
                        book.unloadingTime = booking.unloadingTime;
                        book.travellingTime = booking.travellingTime;
                        book.loadingCapacity = 1 - booking.booking.loadingCapacity;
                        book.isReturnTrip = false;
                        book.willingToShare = false;
                        book.type = "shared";
                        response.push(book);
                    }
                }
            }
            const sortedResponse = response.sort((a, b) => b.bookingDate.getTime() - a.bookingDate.getTime());
            return res.status(common_1.HttpStatus.OK).json(sortedResponse);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getSharedBookings(id, res) {
        try {
            const response = [];
            const resp = await this.driverService.getSharedBooking(id);
            if (resp.length !== 0) {
                for (const booking of resp) {
                    const obj = {};
                    obj.id = booking.id;
                    obj.startLong = booking.startLong;
                    obj.startLat = booking.startLat;
                    obj.destLong = booking.destLong;
                    obj.destLat = booking.destLat;
                    obj.travellingTime = booking.travellingTime;
                    obj.avgHandlingTime = booking.avgHandlingTime;
                    obj.loadingTime = booking.loadingTime;
                    obj.unloadingTime = booking.unloadingTime;
                    obj.vehicleCharge = booking.vehicleCharge;
                    obj.serviceCharge = booking.serviceCharge;
                    response.push(obj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getBookingsCoordinates(id, bookingType, res) {
        try {
            if (bookingType === "original" || bookingType === "shared") {
                const resp = await this.bookingService.getBookingsCoordinates(id, bookingType);
                return res.status(common_1.HttpStatus.OK).json(resp);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async startLoadingTimer(id, res) {
        try {
            this.timersGateway.startLoadingTimer(id);
            return res.status(common_1.HttpStatus.OK).json("Loading timer started");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async stopLoadingTimer(timerReq, id, res) {
        try {
            if (timerReq.bookingType === "original" || timerReq.bookingType === "shared") {
                await this.timersGateway.stopLoadingTimer(timerReq, id);
                return res.status(common_1.HttpStatus.OK).json("Loading timer stopped");
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async startUnloadingTimer(id, res) {
        try {
            this.timersGateway.startUnloadingTimer(id);
            return res.status(common_1.HttpStatus.OK).json("Unloading timer started");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async stopUnloadingTimer(timerReq, id, res) {
        try {
            if (timerReq.bookingType === "original" || timerReq.bookingType === "shared") {
                const resp = await this.timersGateway.stopUnloadingTimer(timerReq, id);
                return res.status(common_1.HttpStatus.OK).json(resp);
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async startRide(rideStartReq, res) {
        try {
            if (rideStartReq.bookingType === 'original' || rideStartReq.bookingType === 'shared') {
                const resp = await this.driverService.startRide(rideStartReq);
                const html = new html_1.HTML(resp.booking.customer.firstName, resp.booking.customer.lastName);
                const message = html.startRide(resp.driver.firstName, resp.driver.lastName, resp.driver.phoneNumber, resp.booking.id);
                await this.commonService.sendNotifications(resp.booking.customer.email, "Your Driver Is On the Way! Ride and Contact Details Inside", message);
                return res.status(common_1.HttpStatus.OK).json("Ride started successfully");
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    sendCorrdinates(coordReq, res) {
        try {
            this.riderGateway.sendCoordinates(coordReq);
            return res.status(common_1.HttpStatus.OK).json("Coordinates sent successfully");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async stopRide(driverId, rideStopReq, res) {
        try {
            if ((rideStopReq.bookingType === 'original' || rideStopReq.bookingType === 'shared') &&
                (rideStopReq.rideType === 'pickup' || rideStopReq.rideType === 'destination')) {
                const resp = await this.driverService.stopRide(driverId, rideStopReq);
                const html = new html_1.HTML(resp.cusFName, resp.cusLName);
                if (rideStopReq.rideType === 'pickup') {
                    const message = html.driverAtPickupLoc(rideStopReq.bookingId, resp.driverFName, resp.driverLName, resp.driverLName);
                    await this.commonService.sendNotifications(resp.email, 'Your driver is at the pickup location!', message);
                }
                else {
                    const message = html.driverAtUnloadingLoc(rideStopReq.bookingId, resp.driverFName, resp.driverLName, resp.driverLName);
                    await this.commonService.sendNotifications(resp.email, 'Your druve is at the unloading location!', message);
                }
                return res.status(common_1.HttpStatus.OK).json("Ride stopped successfully");
            }
            else {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json("Invalid booking type or ride type");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async changeDriverPassword(passwordReq, id, res) {
        try {
            const resp = await this.driverService.changePassword(id, passwordReq);
            if (resp) {
                return res.status(common_1.HttpStatus.OK).json("Password changed successfully");
            }
            return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Old password mismatched");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getProfile(id, res) {
        try {
            const resp = await this.driverService.getProfile(id);
            const profile = new profile_res_1.ProfileRes();
            profile.firstName = resp.firstName;
            profile.lastName = resp.lastName;
            profile.address = resp.address;
            profile.phoneNo = resp.phoneNumber;
            profile.email = resp.email;
            profile.profilePic = resp.photoUrl;
            profile.heavyVehicle = resp.heavyVehicleLic;
            return res.status(common_1.HttpStatus.OK).json(profile);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async updateProfile(profileUpdate, id, res) {
        try {
            const resp = await this.driverService.updateProfile(id, profileUpdate);
            const commonRes = new common_res_1.CommonRes();
            commonRes.id = resp.id;
            return res.status(common_1.HttpStatus.OK).json(commonRes);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getNotifications(id, res) {
        try {
            const response = [];
            const resp = await this.driverService.getNotifications(id);
            if (resp.length !== 0) {
                for (const n of resp) {
                    const notifyObj = new notification_res_1.NotificationRes();
                    notifyObj.id = n.id;
                    notifyObj.timeStamp = n.date;
                    notifyObj.title = n.title;
                    notifyObj.message = n.message;
                    response.push(notifyObj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
};
exports.DriverController = DriverController;
__decorate([
    (0, common_1.Get)('emailAvailability/:email'),
    (0, swagger_1.ApiParam)({
        name: "email",
        required: true,
        type: String,
        description: "driver entered email address"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Email not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: "Email exist" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "check availability of the driver email" }),
    __param(0, (0, common_1.Param)("email")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "emailAvailability", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Driver ID", type: signin_res_1.SignInResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Mismatched" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Driver not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "driver signin" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_dto_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "signin", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('myVehicle/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "driver Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Assigned vehicle" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "No any assign vehicle" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get assigned vehicle by driver" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getAssignVehicle", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('myBookings/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "driver Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of bookings" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get bookings list by driver" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getBookings", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('sharedBookings/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Available shared booking" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get available shared booking" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getSharedBookings", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('getCoordinates/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: "booking Id"
    }),
    (0, swagger_1.ApiQuery)({
        name: 'bookingType',
        required: true,
        type: String,
        description: "booking type",
        enum: ["original", "shared"]
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Coordinates of the locations", type: coordinates_res_1.CoordinatesRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get location coordinates of bookings" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('bookingType')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getBookingsCoordinates", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('startLoading/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "booking Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Loading timer started" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "start the loading timer" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "startLoadingTimer", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('stopLoading/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Loading timer stopped" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "stop the loading timer" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [timer_req_1.TimerReq, String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "stopLoadingTimer", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('startUnloading/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Unloading timer started" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: 'start the unloading timer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "startUnloadingTimer", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('stopUnloading/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Unloading timer stopped", type: bookingComplete_res_1.BookingCompleteRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "stop the unloading timer" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [timer_req_1.TimerReq, String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "stopUnloadingTimer", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('startRide'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Ride started successfully" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "start the ride" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rideStart_req_1.RideStartReq, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "startRide", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('sendCoordinates'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Coordinates sent successfully" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "send current location coordinates" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sendCoord_req_1.SendCoordReq, Object]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "sendCorrdinates", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('stopRide/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'driverId'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Ride stopped successfully" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "stop the ride" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rideStop_req_1.RideStopReq, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "stopRide", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('password/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'driver Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Password changed successfully" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Old password mismatched" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "change driver password" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changePassword_req_1.ChangePasswordReq, String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "changeDriverPassword", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('profile/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'driver Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Profile data", type: profile_res_1.ProfileRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get driver's profile" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('profile/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'driver Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Profile id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "update driver's profile" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateProfile_req_1.UpdateProfileReq, String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('notification/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'driver id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of notifications", type: [notification_res_1.NotificationRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get notifications by driver id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getNotifications", null);
exports.DriverController = DriverController = __decorate([
    (0, swagger_1.ApiTags)("driver"),
    (0, common_1.Controller)('driver'),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => driver_service_1.DriverService))),
    __metadata("design:paramtypes", [driver_service_1.DriverService,
        common_service_1.CommonService,
        auth_service_1.AuthService,
        timers_gateway_1.TimersGateway,
        booking_service_1.BookingService,
        ride_gateways_1.RideGateway])
], DriverController);
//# sourceMappingURL=driver.controller.js.map