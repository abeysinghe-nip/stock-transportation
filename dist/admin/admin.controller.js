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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const tempOwners_dto_1 = require("./dtos/tempOwners.dto");
const common_service_1 = require("../common/common.service");
const html_1 = require("../templates/html");
const admin_dto_1 = require("./dtos/admin.dto");
const signin_res_1 = require("../common/responses/signin.res");
const signIn_dto_1 = require("../common/requests/signIn.dto");
const auth_service_1 = require("../auth/auth.service");
const auth_guard_1 = require("../auth/auth.guard");
const changePassword_req_1 = require("../common/requests/changePassword.req");
const booking_entity_1 = require("../booking/enities/booking.entity");
const bookingCount_res_1 = require("./responses/bookingCount.res");
const booking_service_1 = require("../booking/booking.service");
const feedback_res_1 = require("./responses/feedback.res");
const common_res_1 = require("../common/responses/common.res");
const owners_res_1 = require("./responses/owners.res");
const drivers_res_1 = require("./responses/drivers.res");
const customers_res_1 = require("./responses/customers.res");
let AdminController = class AdminController {
    constructor(adminService, commonService, authService, bookingService) {
        this.adminService = adminService;
        this.commonService = commonService;
        this.authService = authService;
        this.bookingService = bookingService;
    }
    async create(adminDto, res) {
        try {
            const admin = await this.adminService.create(adminDto);
            if (admin) {
                return res.status(common_1.HttpStatus.OK).json("Admin succefully created");
            }
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async signin(signinDto, res) {
        try {
            const admin = await this.adminService.signin(signinDto.userName);
            if (admin) {
                const isMatched = await this.commonService.passwordDecrypt(admin.password, signinDto.password);
                if (isMatched) {
                    const access_token = await this.authService.signin(admin.id, admin.email);
                    return res.status(common_1.HttpStatus.OK).json(access_token);
                }
                return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Mismatched");
            }
            return res.status(common_1.HttpStatus.NOT_FOUND).json("Admin not found");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getTempOwners(res) {
        try {
            const tempOwners = await this.adminService.getTempOwners();
            if (tempOwners.length == 0) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json("Owners not found");
            }
            const response = [];
            for (const to of tempOwners) {
                const ownerDto = new tempOwners_dto_1.TempOwnersDto();
                ownerDto.id = to.id;
                ownerDto.firstName = to.firstName;
                ownerDto.lastName = to.lastName;
                ownerDto.address = to.address;
                ownerDto.nic = to.nic;
                ownerDto.email = to.email;
                ownerDto.mobNumber = to.mobNumber;
                ownerDto.gsCertiUrl = to.gsCertiUrl;
                response.push(ownerDto);
            }
            return res.status(common_1.HttpStatus.ACCEPTED).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async acceptOwner(id, res) {
        try {
            const owner = await this.adminService.acceptOwner(id);
            const html = new html_1.HTML(owner.firstName, owner.lastName);
            const message = html.acceptOwner();
            await this.commonService.sendNotifications(owner.email, 'Your Account Has Been Accepted', message);
            return res.status(common_1.HttpStatus.ACCEPTED).json("Accepted the owner");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async rejectOwner(id, res) {
        try {
            const owner = await this.adminService.rejectOwner(id);
            const html = new html_1.HTML(owner.firstName, owner.lastName);
            const message = html.rejectOwner();
            await this.commonService.sendNotifications(owner.email, 'Your Account Registration Has Been Rejected', message);
            return res.status(common_1.HttpStatus.ACCEPTED).json("Rejected the owner");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getTempDrivers(res) {
        try {
            const tempDrivers = await this.adminService.getTempDrivers();
            if (tempDrivers.length == 0) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json("Drivers not found");
            }
            const response = [];
            for (const driver of tempDrivers) {
                const driverObj = {};
                driverObj.id = driver.id;
                driverObj.firstName = driver.firstName;
                driverObj.lastName = driver.lastName;
                driverObj.email = driver.email;
                driverObj.phoneNumber = driver.phoneNumber;
                driverObj.addres = driver.address;
                driverObj.policeCertiUrl = driver.policeCertiUrl;
                driverObj.licenseUrl = driver.licenseUrl;
                const ownerIdx = response.findIndex((owner) => owner.id == driver.owner.id);
                if (ownerIdx == -1) {
                    const owner = {};
                    owner.id = driver.owner.id;
                    owner.firstName = driver.owner.firstName;
                    owner.lastName = driver.owner.lastName;
                    owner.email = driver.owner.email;
                    owner.mobNumber = driver.owner.mobNumber;
                    owner.drivers = [driverObj];
                    response.push(owner);
                }
                else {
                    response[ownerIdx].drivers.push(driverObj);
                }
            }
            return res.status(common_1.HttpStatus.ACCEPTED).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async acceptDriver(id, res) {
        try {
            const driver = await this.adminService.acceptDriver(id);
            const html = new html_1.HTML(driver.owner.firstName, driver.owner.lastName);
            const message = html.acceptDriver(driver.firstName, driver.lastName);
            await this.commonService.sendNotifications(driver.owner.email, `Driver ${driver.firstName} ${driver.lastName} Accepted and Registered Successfully.`, message);
            return res.status(common_1.HttpStatus.ACCEPTED).json("Accepted the driver");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async rejectDriver(id, res) {
        try {
            const driver = await this.adminService.rejectDriver(id);
            const html = new html_1.HTML(driver.owner.firstName, driver.owner.lastName);
            const message = html.rejectDriver(driver.firstName, driver.lastName);
            await this.commonService.sendNotifications(driver.owner.email, `Driver ${driver.firstName} ${driver.lastName} Rejected and Registeration Failed`, message);
            return res.status(common_1.HttpStatus.ACCEPTED).json("Rejected the driver");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getTempVehicles(res) {
        try {
            const tempVehicles = await this.adminService.getTempVehicles();
            if (tempVehicles.length == 0) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json("Vehicles not found");
            }
            const response = [];
            for (const vehicle of tempVehicles) {
                const vehicleObj = {};
                vehicleObj.id = vehicle.id;
                vehicleObj.type = vehicle.type;
                vehicleObj.regNo = vehicle.regNo;
                vehicleObj.preferredArea = vehicle.preferredArea;
                vehicleObj.capacity = vehicle.capacity;
                vehicleObj.capacityUnit = vehicle.capacityUnit;
                vehicleObj.photoUrl = vehicle.photoUrl;
                vehicleObj.vehicleBookUrl = vehicle.vehicleBookUrl;
                const ownerIdx = response.findIndex((owner) => owner.id === vehicle.owner.id);
                if (ownerIdx == -1) {
                    const owner = {};
                    owner.id = vehicle.owner.id;
                    owner.firstName = vehicle.owner.firstName;
                    owner.lastName = vehicle.owner.lastName;
                    owner.email = vehicle.owner.email;
                    owner.mobNumber = vehicle.owner.mobNumber;
                    owner.vehicles = [vehicleObj];
                    response.push(owner);
                }
                else {
                    response[ownerIdx].vehicles.push(vehicleObj);
                }
            }
            return res.status(common_1.HttpStatus.ACCEPTED).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async acceptVehicle(id, res) {
        try {
            const vehicle = await this.adminService.acceptVehicle(id);
            const html = new html_1.HTML(vehicle.owner.firstName, vehicle.owner.lastName);
            const message = html.acceptVehicle(vehicle.regNo);
            await this.commonService.sendNotifications(vehicle.owner.email, `Vehicle No: ${vehicle.regNo} Accepted and Registered Successfully.`, message);
            return res.status(common_1.HttpStatus.ACCEPTED).json("Accepted the vehicle");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async rejectVehicle(id, res) {
        try {
            const vehicle = await this.adminService.rejectVehicle(id);
            const html = new html_1.HTML(vehicle.owner.firstName, vehicle.owner.lastName);
            const message = html.rejectVehicle(vehicle.regNo);
            await this.commonService.sendNotifications(vehicle.owner.email, `Vehicle No: ${vehicle.regNo} Rejected and Registeration Failed.`, message);
            return res.status(common_1.HttpStatus.ACCEPTED).json("Rejected the vehicle");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async changeDriverPassword(passwordReq, id, res) {
        try {
            const resp = await this.adminService.changePassword(id, passwordReq);
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
    async getUpcomingBookings(res) {
        try {
            const resp = await this.adminService.getBookings();
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getBookingsCount(res) {
        try {
            const resp = await this.bookingService.getBookingsCount();
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getServiceCharges(res) {
        try {
            const resp = await this.bookingService.getServiceCharges();
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getRewards(res) {
        try {
            const resp = await this.bookingService.getRewards();
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getFeedbacks(res) {
        try {
            const feedbackList = [];
            const resp = await this.adminService.getFeedbacks();
            if (resp.length !== 0) {
                for (const f of resp) {
                    const obj = new feedback_res_1.FeedbackRes();
                    obj.id = f.id;
                    obj.customerName = f.customer.firstName + ' ' + f.customer.lastName;
                    obj.feedback = f.feedback;
                    obj.isApproved = f.isApproved;
                    feedbackList.push(obj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(feedbackList);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async approveFeedback(feedbackId, res) {
        try {
            const resp = await this.adminService.approveFeedback(feedbackId);
            const commonRes = new common_res_1.CommonRes();
            commonRes.id = resp.id;
            return res.status(common_1.HttpStatus.OK).json(commonRes);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async deleteFeedback(feedbackId, res) {
        try {
            const resp = await this.adminService.deleteFeedback(feedbackId);
            const commonRes = new common_res_1.CommonRes();
            commonRes.id = resp.id;
            return res.status(common_1.HttpStatus.OK).json(commonRes);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getOwners(res) {
        try {
            const resp = await this.adminService.getOwners();
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getDrivers(ownerId, res) {
        try {
            const resp = await this.adminService.getDrivers(ownerId);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getCustomers(res) {
        try {
            const resp = await this.adminService.getCustomers();
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiBody)({ type: admin_dto_1.AdminDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Admin succefully created" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "create admin" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Signin response", type: signin_res_1.SignInResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Mismatched" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Admin not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "admin signin" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_dto_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "signin", null);
__decorate([
    (0, common_1.Get)('getTempOwners'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "All the pending accounts of owners", type: [tempOwners_dto_1.TempOwnersDto] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Owners not found" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the temporarily registered owners " }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTempOwners", null);
__decorate([
    (0, common_1.Post)('acceptOwner/:id'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "Accepted the owner" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested owner"
    }),
    (0, swagger_1.ApiOperation)({ summary: "accept owner temporarily account by id" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "acceptOwner", null);
__decorate([
    (0, common_1.Delete)('rejectOwner/:id'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "Rejected the owner" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested owner"
    }),
    (0, swagger_1.ApiOperation)({ summary: "reject owner temporarily account by id" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectOwner", null);
__decorate([
    (0, common_1.Get)('getTempDrivers'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "All the pending accounts of drivers" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Drivers not found" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the temporarily registered drivers" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTempDrivers", null);
__decorate([
    (0, common_1.Post)('acceptDriver/:id'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "Accepted the driver" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested driver"
    }),
    (0, swagger_1.ApiOperation)({ summary: "accept driver temporarily account by id" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "acceptDriver", null);
__decorate([
    (0, common_1.Delete)('rejectDriver/:id'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "Rejected the driver" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested driver"
    }),
    (0, swagger_1.ApiOperation)({ summary: "reject driver temporarily account by id" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectDriver", null);
__decorate([
    (0, common_1.Get)('getTempVehicles'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "All the pending creations of vehicles" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Vehicles not found" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the temporarily created vehicles" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTempVehicles", null);
__decorate([
    (0, common_1.Post)('acceptVehicle/:id'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "Accepted the vehicle" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested vehicle"
    }),
    (0, swagger_1.ApiOperation)({ summary: "accept vehicle temporarily creation by id" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "acceptVehicle", null);
__decorate([
    (0, common_1.Delete)('rejectVehicle/:id'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: "Rejected the vehicle" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        type: String,
        required: true,
        description: "ID of the requested vehicle"
    }),
    (0, swagger_1.ApiOperation)({ summary: "reject vehicle temporarily creation by id" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectVehicle", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('password/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'admin Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Password changed successfully" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Old password mismatched" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "change admin password" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changePassword_req_1.ChangePasswordReq, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changeDriverPassword", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('bookings'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Booking list", type: [booking_entity_1.Booking] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the bookings" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUpcomingBookings", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('bookingsCount'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Booking count", type: bookingCount_res_1.BookingCountRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the bookings count" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBookingsCount", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('serviceCharges'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Service charges list and total" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the servcice charges" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getServiceCharges", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('rewards'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Rewards list and total" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the given rewards" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRewards", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('feedbacks'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Feedback list", type: [feedback_res_1.FeedbackRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "all the feedbacks" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('approveFeedback/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'feedback id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Feedback id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "approve feedback" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveFeedback", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)('deleteFeedback/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'feedback id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Feedback id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "delete feedback" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteFeedback", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('owners'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Available owners list", type: [owners_res_1.OwnersRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the owners" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOwners", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('drivers/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Available drivers list", type: [drivers_res_1.DriversRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the drivers by the owner" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDrivers", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('customers'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Available customers list", type: [customers_res_1.CustomersRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all the available customers" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCustomers", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)("system admin"),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        common_service_1.CommonService,
        auth_service_1.AuthService,
        booking_service_1.BookingService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map