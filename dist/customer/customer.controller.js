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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_service_1 = require("./customer.service");
const cutomer_dto_1 = require("./dtos/cutomer.dto");
const signIn_dto_1 = require("../common/requests/signIn.dto");
const common_service_1 = require("../common/common.service");
const html_1 = require("../templates/html");
const signin_res_1 = require("../common/responses/signin.res");
const vehicle_service_1 = require("../vehicle/vehicle.service");
const booking_service_1 = require("../booking/booking.service");
const auth_guard_1 = require("../auth/auth.guard");
const booking_dto_1 = require("../booking/dtos/booking.dto");
const charges_res_1 = require("./responses/charges.res");
const intent_res_1 = require("./responses/intent.res");
const intent_req_1 = require("./requests/intent.req");
const bookingCancel_dto_1 = require("../booking/dtos/bookingCancel.dto");
const common_res_1 = require("../common/responses/common.res");
const payment_dto_1 = require("../booking/dtos/payment.dto");
const calCharge_req_1 = require("./requests/calCharge.req");
const sharedBooking_req_1 = require("./requests/sharedBooking.req");
const moment = require("moment");
const balPayment_req_1 = require("./requests/balPayment.req");
const rateReview_req_1 = require("./requests/rateReview.req");
const changePassword_req_1 = require("../common/requests/changePassword.req");
const customerRewards_req_1 = require("./requests/customerRewards.req");
const profile_res_1 = require("./responses/profile.res");
const updateProfile_req_1 = require("../common/requests/updateProfile.req");
const auth_service_1 = require("../auth/auth.service");
const paymentHistory_res_1 = require("./responses/paymentHistory.res");
const notification_res_1 = require("../common/responses/notification.res");
const feedback_req_1 = require("./requests/feedback.req");
const allBookings_res_1 = require("./responses/allBookings.res");
let CustomerController = class CustomerController {
    constructor(customerService, commonService, vehicleService, bookingService, authService) {
        this.customerService = customerService;
        this.commonService = commonService;
        this.vehicleService = vehicleService;
        this.bookingService = bookingService;
        this.authService = authService;
    }
    async createCustomer(customerDto, res) {
        try {
            const customer = await this.customerService.createCustomer(customerDto);
            const html = new html_1.HTML(customer.firstName, customer.lastName);
            const message = html.createCustomer();
            await this.commonService.sendNotifications(customer.email, 'Your Account is Successfully Created', message);
            return res.status(common_1.HttpStatus.OK).json("Owner succefully created");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async emailAvailability(email, res) {
        try {
            const resp = await this.customerService.emailAvilability(email);
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
            const customer = await this.customerService.signin(signinDto.userName);
            if (customer) {
                const isMatched = await this.commonService.passwordDecrypt(customer.password, signinDto.password);
                if (isMatched) {
                    const access_token = await this.authService.signin(customer.id, customer.email);
                    return res.status(common_1.HttpStatus.OK).json(access_token);
                }
                return res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json("Mismatched");
            }
            return res.status(common_1.HttpStatus.NOT_FOUND).json("customer not found");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getVehicles(res) {
        try {
            const response = [];
            const vehicles = await this.vehicleService.getAllVehicles();
            if (vehicles.length !== 0) {
                for (const vehicle of vehicles) {
                    const vehicleObj = {};
                    vehicleObj.id = vehicle.id;
                    vehicleObj.type = vehicle.type;
                    vehicleObj.preferredArea = vehicle.preferredArea;
                    vehicleObj.capacity = vehicle.capacity;
                    vehicleObj.capacityUnit = vehicle.capacityUnit;
                    vehicleObj.photoUrl = vehicle.photoUrl;
                    vehicleObj.chargePerKm = vehicle.chargePerKm;
                    response.push(vehicleObj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async calCharges(calChargeReq, res) {
        try {
            const resp = await this.bookingService.calCharges(calChargeReq);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async booking(bookingDto, res) {
        try {
            const booking = await this.bookingService.create(bookingDto);
            if (booking.id) {
                const commonRes = new common_res_1.CommonRes();
                commonRes.id = booking.id;
                return res.status(common_1.HttpStatus.OK).json(commonRes);
            }
            ;
            return res.status(common_1.HttpStatus.CONFLICT).json("Another booking available");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getBookings(id, res) {
        try {
            const response = [];
            const bookings = await this.bookingService.getBookingsCustomer(id);
            if (bookings.length !== 0) {
                for (const booking of bookings) {
                    const res = {};
                    res.id = booking.id;
                    res.createdAt = booking.createdAt;
                    res.bookingDate = booking.bookingDate;
                    res.pickupTime = booking.pickupTime;
                    res.startLong = booking.startLong;
                    res.startLat = booking.startLat;
                    res.destLong = booking.destLong;
                    res.destLat = booking.destLat;
                    res.loadingTime = booking.loadingTime;
                    res.unloadingTime = booking.unloadingTime;
                    res.travellingTime = booking.travellingTime;
                    res.vehicleCharge = booking.vehicleCharge;
                    res.loadingCapacity = booking.loadingCapacity;
                    res.isReturnTrip = booking.isReturnTrip;
                    res.willingToShare = booking.willingToShare;
                    res.isCancelled = booking.isCancelled;
                    res.status = booking.status;
                    res.type = "original";
                    if (booking.advancePayment) {
                        res.isPaid = true;
                    }
                    else {
                        res.isPaid = false;
                    }
                    const vehicleObj = {};
                    vehicleObj.id = booking.vehicle.id;
                    vehicleObj.type = booking.vehicle.type;
                    vehicleObj.preferredArea = booking.vehicle.preferredArea;
                    vehicleObj.capacity = booking.vehicle.capacity;
                    vehicleObj.capacityUnit = booking.vehicle.capacityUnit;
                    vehicleObj.photoUrl = booking.vehicle.photoUrl;
                    vehicleObj.chargePerKm = booking.vehicle.chargePerKm;
                    res.vehicle = vehicleObj;
                    if (booking.status === 'complete') {
                        const driverObj = {};
                        driverObj.id = booking.balPayment.driver.id;
                        driverObj.firstName = booking.balPayment.driver.firstName;
                        driverObj.lastName = booking.balPayment.driver.lastName;
                        res.driver = driverObj;
                    }
                    response.push(res);
                }
            }
            const sharedBookings = await this.bookingService.getOriginalCancelledShared(id);
            if (sharedBookings.length !== 0) {
                for (const sBooking of sharedBookings) {
                    response.push(sBooking);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(response);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async createPaymentIntent(intentReq, res) {
        try {
            const resp = await this.bookingService.createPaymentIntent(intentReq);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async recordPayment(type, paymentDto, id, res) {
        try {
            if (paymentDto.type === "original" || paymentDto.type === "shared") {
                const resp = await this.bookingService.recordPayment(id, type, paymentDto);
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
    async cancelBooking(bookingCancelDto, id, res) {
        try {
            const resp = await this.bookingService.cancelBooking(bookingCancelDto, id);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getSharedBookings(res) {
        try {
            const bookings = await this.bookingService.getSharedBoookings();
            return res.status(common_1.HttpStatus.OK).json(bookings);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async makeSharedBooking(booking, res) {
        try {
            const resp = await this.bookingService.makeSharedBooking(booking);
            if (resp.id)
                return res.status(common_1.HttpStatus.OK).json({ bokingId: resp.id });
            return res.status(common_1.HttpStatus.CONFLICT).json("Another booking available");
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async cancelSharedBooking(bookingCancelDto, id, res) {
        try {
            const resp = await this.bookingService.cancelSharedBooking(bookingCancelDto, id);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getSharedBookingByCustomer(id, res) {
        try {
            const bookings = await this.bookingService.getSharedBookingsByCustomer(id);
            const resp = [];
            if (bookings.length !== 0) {
                for (const booking of bookings) {
                    const r = {};
                    r.id = booking.id;
                    r.date = booking.booking.bookingDate;
                    r.startLong = booking.startLong;
                    r.startLat = booking.startLat;
                    r.destLong = booking.destLong;
                    r.destLat = booking.destLat;
                    r.travellingTime = booking.travellingTime;
                    r.loadingTime = booking.loadingTime;
                    r.unloadingTime = booking.unloadingTime;
                    r.avgHandlingTime = booking.avgHandlingTime;
                    r.loadingTimer = booking.loadingTime;
                    r.unloadingTime = booking.unloadingTime;
                    r.vehicleCharge = booking.vehicleCharge;
                    r.serviceCharge = booking.serviceCharge;
                    r.status = booking.status;
                    r.isCancelled = booking.isCancelled;
                    const b = {};
                    b.id = booking.booking.id;
                    b.pickupTime = moment(booking.booking.pickupTime, "H:mm").format("LT");
                    b.endTime = moment(booking.booking.pickupTime, "H:mm").add((booking.booking.travellingTime + booking.booking.avgHandlingTime), 'minutes').format("LT");
                    b.loadingCapacity = booking.booking.loadingCapacity;
                    b.freeCapacity = 1 - booking.booking.loadingCapacity;
                    r.booking = b;
                    const v = {};
                    v.id = booking.booking.vehicle.id;
                    v.type = booking.booking.vehicle.type;
                    v.preferredArea = booking.booking.vehicle.preferredArea;
                    v.capacity = booking.booking.vehicle.capacity;
                    v.capacityUnit = booking.booking.vehicle.capacityUnit;
                    v.chargePerKm = booking.booking.vehicle.chargePerKm;
                    v.photoUrl = booking.booking.vehicle.photoUrl;
                    r.vehicle = v;
                    resp.push(r);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async recordBalPayment(paymentReq, bookingId, res) {
        try {
            if (paymentReq.bookingType === 'original' || paymentReq.bookingType === 'shared') {
                const resp = await this.bookingService.recordBalPayment(paymentReq, bookingId);
                const html = new html_1.HTML(resp.booking.customer.firstName, resp.booking.customer.lastName);
                const message = html.boookingComplete(resp.booking.id, moment().format('YYYY-MM-DD'));
                await this.commonService.sendNotifications(resp.booking.customer.email, 'Your Ride is Completed!', message);
                const commonRes = new common_res_1.CommonRes();
                commonRes.id = resp.bookingId;
                return res.status(common_1.HttpStatus.OK).json(commonRes);
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
    async makeRateReview(rateReviewReq, id, res) {
        try {
            if (rateReviewReq.bookingType === 'original' || rateReviewReq.bookingType === 'shared') {
                const resp = await this.bookingService.makeRateReview(rateReviewReq, id);
                const commonRes = new common_res_1.CommonRes();
                commonRes.id = resp.id;
                return res.status(common_1.HttpStatus.OK).json(commonRes);
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
    async changeDriverPassword(passwordReq, id, res) {
        try {
            const resp = await this.customerService.changePassword(id, passwordReq);
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
    async getRewards(id, res) {
        try {
            const customerRewards = [];
            const resp = await this.customerService.getRewards(id);
            if (resp.length !== 0) {
                for (const r of resp) {
                    const respObj = new customerRewards_req_1.CustomerRewardsReq();
                    respObj.id = r.id;
                    respObj.date = r.date;
                    respObj.isClaimed = r.isClaimed;
                    respObj.percentage = r.reward;
                    customerRewards.push(respObj);
                }
            }
            return res.status(common_1.HttpStatus.OK).json(customerRewards);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getProfile(id, res) {
        try {
            const resp = await this.customerService.getProfile(id);
            const profile = new profile_res_1.ProfileRes();
            profile.firstName = resp.firstName;
            profile.lastName = resp.lastName;
            profile.address = resp.address;
            profile.gender = resp.gender;
            profile.nic = resp.nic;
            profile.phoneNo = resp.mobileNum;
            profile.email = resp.email;
            profile.profilePic = resp.profilePic;
            return res.status(common_1.HttpStatus.OK).json(profile);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async updateProfile(profileUpdate, id, res) {
        try {
            const resp = await this.customerService.updateProfile(id, profileUpdate);
            const commonRes = new common_res_1.CommonRes();
            commonRes.id = resp.id;
            return res.status(common_1.HttpStatus.OK).json(commonRes);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getPaymentHistory(id, res) {
        try {
            const resp = await this.bookingService.getPaymentHistory(id);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getNotifications(id, res) {
        try {
            const response = [];
            const resp = await this.customerService.getNotifications(id);
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
    async getReturnTrips(res) {
        try {
            const response = [];
            const bookings = await this.bookingService.getReturnTrips();
            if (bookings.length !== 0) {
                for (const b of bookings) {
                    const obj = {};
                    obj.id = b.id;
                    obj.bookingDate = b.bookingDate;
                    obj.startLong = b.destLong;
                    obj.startLat = b.destLat;
                    obj.destLong = b.startLong;
                    obj.destLat = b.startLat;
                    obj.vehileId = b.vehicle.id;
                    obj.pickupTime = moment(b.pickupTime, 'HH:mm:ss').add(b.avgHandlingTime, 'minutes').format('HH:mm:ss');
                    if (b.sharedBooking) {
                        for (const s of b.sharedBooking) {
                            if (s.isCancelled === false) {
                                obj.pickupTime = moment(obj.pickupTime, 'HH:mm:ss').add(s.avgHandlingTime, 'minutes').format('HH:mm:ss');
                            }
                        }
                    }
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
    async makeFeedback(id, feedback, res) {
        try {
            const resp = await this.customerService.makeFeedback(id, feedback);
            const commonRes = new common_res_1.CommonRes();
            commonRes.id = resp.id;
            return res.status(common_1.HttpStatus.OK).json(commonRes);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
    async getBalancePaymentPendings(customerId, res) {
        try {
            const resp = await this.bookingService.getBalancePaymentPendings(customerId);
            return res.status(common_1.HttpStatus.OK).json(resp);
        }
        catch (error) {
            console.log(error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Post)('createCustomer'),
    (0, swagger_1.ApiBody)({ type: cutomer_dto_1.CustomerDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Customer succefully created" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "create customer" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cutomer_dto_1.CustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Get)('emailAvailability/:email'),
    (0, swagger_1.ApiParam)({
        name: "email",
        required: true,
        type: String,
        description: "owner entered email address"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Email not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: "Email exist" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "check availability of the customer email" }),
    __param(0, (0, common_1.Param)("email")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "emailAvailability", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Customer ID", type: signin_res_1.SignInResponse }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Mismatched" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Customer not found" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "customer signin" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_dto_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "signin", null);
__decorate([
    (0, common_1.Get)('vehicles'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Vehicles List" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get all vehicles" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getVehicles", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('calCharge'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Calculated charges", type: charges_res_1.ChargesRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "calculate charges for booking" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calCharge_req_1.CalChargeReq, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "calCharges", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('booking'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Booking Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: "Another booking available" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "make a booking" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.BookingDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "booking", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('myBookings/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "customer Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "list of bookings" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get bookings list by customer" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getBookings", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('paymentIntent'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Payment intent", type: intent_res_1.IntentRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "create payment intent for a booking" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [intent_req_1.IntentReq, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('advancePayment/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "booking Id"
    }),
    (0, swagger_1.ApiQuery)({
        name: "type",
        required: true,
        type: String,
        enum: ["normal", "return"],
        description: "booking type"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Payment Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "record advance payment data" }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.PaymentDto, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('cancelBooking/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "booking Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Cancelled booking Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "cancel booking" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookingCancel_dto_1.BookingCancelDto, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('sharedBookings'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of shared bookings" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get shared bookings" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getSharedBookings", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('sharedBooking'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Booking Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: "Another booking available" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "make a shared booking" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sharedBooking_req_1.SharedBookingReq, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "makeSharedBooking", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('cancelSharedBooking/:id'),
    (0, swagger_1.ApiParam)({
        name: "id",
        required: true,
        type: String,
        description: "shared booking id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Cancelled booking Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "cancel shared booking" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bookingCancel_dto_1.BookingCancelDto, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "cancelSharedBooking", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('customerSharedBooking/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: "customer Id"
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of customer's shared booking" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get shared booking by customer id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getSharedBookingByCustomer", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('balPaymant/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Payment Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "record balance payment data" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [balPayment_req_1.BalPaymentReq, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "recordBalPayment", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('rate/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Rate Id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "record customer rate and review for a booking" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rateReview_req_1.RateReviewReq, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "makeRateReview", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('password/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Password changed successfully" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_ACCEPTABLE, description: "Old password mismatched" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "change customer password" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changePassword_req_1.ChangePasswordReq, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "changeDriverPassword", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('rewards/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of rewards", type: [customerRewards_req_1.CustomerRewardsReq] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "customer's rewards" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getRewards", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('profile/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Profile data", type: [profile_res_1.ProfileRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get customer's profile" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('profile/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Profile id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "update customer's profile" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateProfile_req_1.UpdateProfileReq, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('payment/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Payment summary", type: [paymentHistory_res_1.PaymentHistoryRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: "Invalid booking type" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get payment history by customer id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getPaymentHistory", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('notification/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of notifications", type: [notification_res_1.NotificationRes] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get notifications by customer id" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('returnTrips'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of return trips" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get available return trips" }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getReturnTrips", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('feedback/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Feedback id", type: common_res_1.CommonRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "make a feedback" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, feedback_req_1.FeedbackReq, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "makeFeedback", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('balPaymentsPending/:id'),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "List of balance payment pending bookings", type: allBookings_res_1.AllBookingsRes }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: "Unauthorized user" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" }),
    (0, swagger_1.ApiOperation)({ summary: "get balance payment pending bookings" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getBalancePaymentPendings", null);
exports.CustomerController = CustomerController = __decorate([
    (0, swagger_1.ApiTags)("customer"),
    (0, common_1.Controller)('customer'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService,
        common_service_1.CommonService,
        vehicle_service_1.VehicleService,
        booking_service_1.BookingService,
        auth_service_1.AuthService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map