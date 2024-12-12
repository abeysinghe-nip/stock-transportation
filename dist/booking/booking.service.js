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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./enities/booking.entity");
const typeorm_2 = require("typeorm");
const driver_vehicle_entity_1 = require("../driver/entities/driver.vehicle.entity");
const moment = require("moment");
const customer_entity_1 = require("../customer/entities/customer.entity");
const vehicle_entity_1 = require("../vehicle/entities/vehicle.entity");
const charges_res_1 = require("../customer/responses/charges.res");
const st = require("stripe");
const intent_res_1 = require("../customer/responses/intent.res");
const advancePayment_entity_1 = require("./enities/advancePayment.entity");
const common_res_1 = require("../common/responses/common.res");
const ownerCredit_entity_1 = require("../owner/entities/ownerCredit.entity");
const ownerWallet_entity_1 = require("../owner/entities/ownerWallet.entity");
const bookingCancel_entity_1 = require("./enities/bookingCancel.entity");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const sharedBooking_entity_1 = require("./enities/sharedBooking.entity");
const sharedBookingCancel_entity_1 = require("./enities/sharedBookingCancel.entity");
const bookingComplete_res_1 = require("../driver/responses/bookingComplete.res");
const coordinates_res_1 = require("../driver/responses/coordinates.res");
const balPayment_entity_1 = require("./enities/balPayment.entity");
const serviceCharge_entity_1 = require("./enities/serviceCharge.entity");
const rateReview_entity_1 = require("./enities/rateReview.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
const ownerRewards_entity_1 = require("../owner/entities/ownerRewards.entity");
const customerRewards_entity_1 = require("../customer/entities/customerRewards.entity");
const bookingCount_res_1 = require("../admin/responses/bookingCount.res");
const cancelledReason_res_1 = require("../common/responses/cancelledReason.res");
const sharedBooking_res_1 = require("../common/responses/sharedBooking.res");
const paymentHistory_res_1 = require("../customer/responses/paymentHistory.res");
const driversBookingCount_res_1 = require("../owner/responses/driversBookingCount.res");
const notification_gateway_1 = require("../gateways/notification.gateway");
const notification_req_1 = require("../common/requests/notification.req");
const allBookings_res_1 = require("../customer/responses/allBookings.res");
const booking_res_1 = require("../common/responses/booking.res");
const booking_res_2 = require("../customer/responses/booking.res");
const sharedBooking_res_2 = require("../customer/responses/sharedBooking.res");
require('dotenv').config();
const stripe = new st.Stripe(process.env.STRIPE_SECRET);
const client = new google_maps_services_js_1.Client();
let BookingService = class BookingService {
    constructor(repo, driverVehiRepo, customerRepo, vehicleRepo, paymentRepo, ownerCreditRepo, ownerWalletRepo, bookingCancelRepo, sharedBookingRepo, sharedBookingCancelRepo, balPaymentRepo, serviceChargeRepo, driverRepo, rateReviewRepo, ownerRewardsRepo, customerRewardsRepo, notifications) {
        this.repo = repo;
        this.driverVehiRepo = driverVehiRepo;
        this.customerRepo = customerRepo;
        this.vehicleRepo = vehicleRepo;
        this.paymentRepo = paymentRepo;
        this.ownerCreditRepo = ownerCreditRepo;
        this.ownerWalletRepo = ownerWalletRepo;
        this.bookingCancelRepo = bookingCancelRepo;
        this.sharedBookingRepo = sharedBookingRepo;
        this.sharedBookingCancelRepo = sharedBookingCancelRepo;
        this.balPaymentRepo = balPaymentRepo;
        this.serviceChargeRepo = serviceChargeRepo;
        this.driverRepo = driverRepo;
        this.rateReviewRepo = rateReviewRepo;
        this.ownerRewardsRepo = ownerRewardsRepo;
        this.customerRewardsRepo = customerRewardsRepo;
        this.notifications = notifications;
    }
    async calCharges(calChargeReq) {
        const vehicle = await this.vehicleRepo.findOne({
            where: {
                id: calChargeReq.vehicleId,
            },
        });
        let vehicleCharge = Number(vehicle.chargePerKm * calChargeReq.distance);
        if (calChargeReq.retrurnTrip) {
            vehicleCharge = vehicleCharge * 2;
        }
        const chargesRes = new charges_res_1.ChargesRes();
        chargesRes.vehicleCharge = parseFloat(vehicleCharge.toFixed(2));
        chargesRes.serviceCharge = parseFloat(((vehicleCharge * 7) / 100).toFixed(2));
        chargesRes.total = chargesRes.vehicleCharge + chargesRes.serviceCharge;
        chargesRes.advancePayment = (chargesRes.total * 10) / 100;
        return chargesRes;
    }
    async create(bookingDto) {
        const booking = new booking_entity_1.Booking();
        const vehicle = await this.vehicleRepo.findOne({
            where: {
                id: bookingDto.vehicleId,
            },
        });
        const availableBookings = await this.repo.find({
            where: {
                vehicle: vehicle,
                bookingDate: bookingDto.bookingDate,
            },
        });
        if (availableBookings.length !== 0) {
            const bookingStartTime = moment(bookingDto.pickupTime, 'H:mm');
            const bookingTravelTime = bookingDto.travellingTime * 60;
            const bookingEndTime = moment(bookingDto.pickupTime, 'H:mm').add(bookingTravelTime + bookingDto.avgHandlingTime, 'minutes');
            for (const available of availableBookings) {
                if (!available.isCancelled) {
                    const startTime = moment(available.pickupTime, 'H:mm');
                    const travelTimeInMins = available.travellingTime * 60;
                    const handlingTimeInMins = available.avgHandlingTime * 60;
                    const endTime = moment(available.pickupTime, 'H:mm').add(travelTimeInMins + handlingTimeInMins, 'minutes');
                    const isConflict = bookingStartTime.isSameOrBefore(endTime) &&
                        bookingEndTime.isSameOrAfter(startTime);
                    if (isConflict)
                        return booking;
                }
                const sharedBooking = await this.sharedBookingRepo.findOne({
                    where: {
                        booking: available,
                        isCancelled: false,
                    },
                });
                if (sharedBooking) {
                    const startTime = moment(available.pickupTime, 'H:mm');
                    const travelTimeInMins = sharedBooking.travellingTime * 60;
                    const handlingTimeInMins = sharedBooking.avgHandlingTime * 60;
                    const endTime = moment(available.pickupTime, 'H:mm').add(travelTimeInMins + handlingTimeInMins, 'minutes');
                    const isConflict = bookingStartTime.isSameOrBefore(endTime) &&
                        bookingEndTime.isSameOrAfter(startTime);
                    if (isConflict)
                        return booking;
                }
            }
        }
        const customer = await this.customerRepo.findOne({
            where: {
                id: bookingDto.customerId,
            },
        });
        booking.createdAt = new Date();
        booking.bookingDate = bookingDto.bookingDate;
        booking.pickupTime = bookingDto.pickupTime;
        booking.startLong = bookingDto.startLong;
        booking.startLat = bookingDto.startLat;
        booking.destLong = bookingDto.destLong;
        booking.destLat = bookingDto.destLat;
        if (bookingDto.isReturnTrip) {
            booking.travellingTime = (Number(bookingDto.travellingTime) / 60) * 2;
        }
        else {
            booking.travellingTime = Number(bookingDto.travellingTime) / 60;
        }
        booking.vehicleCharge = bookingDto.vehicleCharge;
        booking.serviceCharge = bookingDto.serviceCharge;
        booking.loadingCapacity = bookingDto.loadingCapacity;
        booking.isReturnTrip = bookingDto.isReturnTrip;
        booking.willingToShare = bookingDto.willingToShare;
        booking.avgHandlingTime = bookingDto.avgHandlingTime;
        booking.vehicle = vehicle;
        booking.customer = customer;
        const notification = new notification_req_1.NotificationReq();
        notification.timeStamp = new Date();
        notification.title = "Booking Alert!";
        notification.message = "Booking successfully created. Please make the advance payment to confirm";
        notification.userId = customer.id;
        await this.notifications.sendCustomerNotification(notification);
        return await this.repo.save(booking);
    }
    async getBookingsCustomer(id) {
        return await this.repo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.advancePayment', 'advancePayment')
            .leftJoinAndSelect('booking.vehicle', 'vehicle')
            .leftJoinAndSelect('booking.balPayment', 'balPayment')
            .leftJoinAndSelect('balPayment.driver', 'driver')
            .where('booking.customerId = :id', { id })
            .orderBy('booking.bookingDate', 'ASC')
            .getMany();
    }
    async createPaymentIntent(intentReq) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(intentReq.amount) * 100),
            currency: 'lkr',
        });
        const intentRes = new intent_res_1.IntentRes();
        intentRes.clientSecret = paymentIntent.client_secret;
        return intentRes;
    }
    async recordPayment(bookingId, type, paymentDto) {
        const advancePayment = new advancePayment_entity_1.AdvancePayment();
        advancePayment.date = new Date();
        advancePayment.amount = paymentDto.amount;
        advancePayment.stripeId = paymentDto.stripeId;
        const newPayment = await this.paymentRepo.save(advancePayment);
        let booking;
        if (paymentDto.type === 'original') {
            booking = await this.repo.findOne({
                where: {
                    id: bookingId,
                },
                relations: ['customer', 'vehicle.owner']
            });
            if (type === "return") {
                booking.isReturnTrip = true;
            }
            booking.advancePayment = newPayment;
            await this.repo.save(booking);
        }
        else {
            booking = await this.sharedBookingRepo.findOne({
                where: {
                    id: bookingId,
                },
                relations: ['customer', 'booking.vehicle.owner']
            });
            booking.advancePayment = newPayment;
            await this.sharedBookingRepo.save(booking);
        }
        const notification = new notification_req_1.NotificationReq();
        notification.timeStamp = new Date();
        notification.title = "Payment Alert!";
        notification.message = "You payment has been recorded. Thank you for the confirmation.";
        notification.userId = booking.customer.id;
        await this.notifications.sendCustomerNotification(notification);
        notification.timeStamp = new Date();
        notification.title = "Booking Alert!";
        notification.message = "You have received new booking! Check in the dashboard";
        notification.userId = booking instanceof booking_entity_1.Booking ? booking.vehicle.owner.id : booking.booking.vehicle.owner.id;
        await this.notifications.sendOwnerNotification(notification);
        const commonRes = new common_res_1.CommonRes();
        commonRes.id = newPayment.id;
        return commonRes;
    }
    async cancelBooking(bookingCancelDto, id) {
        const booking = await this.repo.findOne({
            where: {
                id: id,
            },
            relations: ['advancePayment', 'vehicle.owner', 'customer'],
        });
        if (booking.advancePayment) {
            const ownerCharge = (booking.advancePayment.amount * 30) / 100;
            const updatedWallet = await this.updateWallet(booking.vehicle.owner, ownerCharge);
            await this.recordOwnerTransaction(ownerCharge, booking, updatedWallet);
            const amount = (booking.advancePayment.amount * 70) / 100;
            await this.recordServiceCharge(amount, booking, 'cancelled');
            const notification = new notification_req_1.NotificationReq();
            notification.timeStamp = new Date();
            notification.title = "Booking Cancellation!";
            notification.message = `The booking on ${booking.bookingDate} has been cancelled by the customer`;
            notification.userId = booking.vehicle.owner.id;
            await this.notifications.sendOwnerNotification(notification);
        }
        booking.isCancelled = true;
        booking.status = 'cancelled';
        await this.repo.save(booking);
        const bookingCancel = new bookingCancel_entity_1.BookingCancel();
        bookingCancel.date = new Date();
        bookingCancel.reason = bookingCancelDto.reason;
        bookingCancel.booking = booking;
        await this.bookingCancelRepo.save(bookingCancel);
        const notification = new notification_req_1.NotificationReq();
        notification.timeStamp = new Date();
        notification.title = "Booking Cancellation!";
        notification.message = "Your booking has been cancelled";
        notification.userId = booking.customer.id;
        await this.notifications.sendCustomerNotification(notification);
        const commonRes = new common_res_1.CommonRes();
        commonRes.id = booking.id;
        return commonRes;
    }
    async getBookingsByOwner(ownerId) {
        return await this.repo
            .createQueryBuilder('bookings')
            .leftJoinAndSelect('bookings.vehicle', 'vehicle')
            .leftJoinAndSelect('bookings.customer', 'customer')
            .where('vehicle.ownerId = :ownerId', { ownerId: ownerId })
            .andWhere('bookings.status = :status', { status: 'upcoming' })
            .andWhere('bookings.isCancelled = :cancelled', { cancelled: false })
            .andWhere('bookings.advancePayment IS NOT NULL')
            .orderBy('bookings.bookingDate', 'ASC')
            .getMany();
    }
    async getSharedBoookings() {
        const bookings = await this.repo.find({
            where: {
                status: 'upcoming',
                advancePayment: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()),
                isCancelled: false,
                willingToShare: true,
            },
            relations: ['vehicle'],
        });
        const sBookings = [];
        if (bookings.length !== 0) {
            for (const booking of bookings) {
                booking.id;
                const isExist = await this.sharedBookingRepo
                    .createQueryBuilder('sharedBooking')
                    .where('sharedBooking.bookingId = :bookingId', {
                    bookingId: booking.id,
                })
                    .andWhere('sharedBooking.isCancelled = :isCancelled', {
                    isCancelled: false,
                })
                    .getOne();
                if (!isExist) {
                    const sBooking = {};
                    sBooking.id = booking.id;
                    sBooking.bookingDate = booking.bookingDate;
                    sBooking.pickupTime = moment(booking.pickupTime, 'H:mm').format('LT');
                    sBooking.endTime = moment(booking.pickupTime, 'H:mm')
                        .add(booking.travellingTime + booking.avgHandlingTime, 'minutes')
                        .format('LT');
                    sBooking.loadingCapacity = booking.loadingCapacity;
                    sBooking.freeCapacity = 1 - booking.loadingCapacity;
                    sBooking.nearbyCities = await this.getNearbyCities(booking.startLat, booking.startLong, booking.destLat, booking.destLong);
                    const vehicle = {};
                    vehicle.id = booking.vehicle.id;
                    vehicle.type = booking.vehicle.type;
                    vehicle.preferredArea = booking.vehicle.preferredArea;
                    vehicle.capacity = booking.vehicle.capacity;
                    vehicle.capacityUnit = booking.vehicle.capacityUnit;
                    vehicle.chargePerKm = booking.vehicle.chargePerKm;
                    vehicle.photoUrl = booking.vehicle.photoUrl;
                    sBooking.vehicle = vehicle;
                    sBookings.push(sBooking);
                }
            }
        }
        return sBookings;
    }
    async makeSharedBooking(sBooking) {
        const newBooking = new sharedBooking_entity_1.SharedBooking();
        const booking = await this.repo.findOne({
            where: {
                id: sBooking.bookingId,
            },
        });
        const customer = await this.customerRepo.findOne({
            where: {
                id: sBooking.customerId,
            },
        });
        newBooking.startLong = sBooking.startLong;
        newBooking.startLat = sBooking.startLat;
        newBooking.destLong = sBooking.destLong;
        newBooking.destLat = sBooking.destLat;
        newBooking.travellingTime = sBooking.travellingTime;
        newBooking.avgHandlingTime = sBooking.avgHandlingTime;
        newBooking.vehicleCharge = sBooking.vehicleCharge;
        newBooking.serviceCharge = sBooking.serviceCharge;
        newBooking.booking = booking;
        newBooking.customer = customer;
        const notification = new notification_req_1.NotificationReq();
        notification.timeStamp = new Date();
        notification.title = "Booking Alert!";
        notification.message = "Booking successfully created. Please make the advance payment to confirm";
        notification.userId = customer.id;
        await this.notifications.sendCustomerNotification(notification);
        return await this.sharedBookingRepo.save(newBooking);
    }
    async cancelSharedBooking(bookingCancelDto, id) {
        const booking = await this.sharedBookingRepo.findOne({
            where: {
                id: id,
            },
            relations: ['advancePayment', 'booking.vehicle.owner'],
        });
        if (booking.advancePayment) {
            const ownerCharge = (booking.advancePayment.amount * 30) / 100;
            const updatedWallet = await this.updateWallet(booking.booking.vehicle.owner, ownerCharge);
            await this.recordOwnerTransaction(ownerCharge, booking, updatedWallet);
            const amount = (booking.advancePayment.amount * 70) / 100;
            await this.recordServiceCharge(amount, booking, 'cancelled');
            const notification = new notification_req_1.NotificationReq();
            notification.timeStamp = new Date();
            notification.title = "Booking Cancellation!";
            notification.message = `The booking on ${booking.booking.bookingDate} has been cancelled by the customer`;
            notification.userId = booking.booking.vehicle.owner.id;
            await this.notifications.sendOwnerNotification(notification);
        }
        booking.isCancelled = true;
        await this.sharedBookingRepo.save(booking);
        const bookingCancel = new sharedBookingCancel_entity_1.SharedBookingCancel();
        bookingCancel.date = new Date();
        bookingCancel.reason = bookingCancelDto.reason;
        bookingCancel.sharedBooking = booking;
        await this.sharedBookingCancelRepo.save(bookingCancel);
        const notification = new notification_req_1.NotificationReq();
        notification.timeStamp = new Date();
        notification.title = "Booking Cancellation!";
        notification.message = "Your booking has been cancelled";
        notification.userId = booking.customer.id;
        await this.notifications.sendCustomerNotification(notification);
        const commonRes = new common_res_1.CommonRes();
        commonRes.id = booking.id;
        return commonRes;
    }
    async getSharedBookingsByCustomer(id) {
        return await this.sharedBookingRepo
            .createQueryBuilder('sharedBooking')
            .leftJoinAndSelect('sharedBooking.booking', 'booking')
            .leftJoinAndSelect('booking.vehicle', 'vehicle')
            .where('sharedBooking.customerId = :customerId', { customerId: id })
            .getMany();
    }
    async getBookingsCoordinates(bookingId, bookingType) {
        const resp = new coordinates_res_1.CoordinatesRes();
        if (bookingType === "original") {
            const booking = await this.repo.findOne({
                where: {
                    id: bookingId
                }
            });
            const sharedBooking = await this.sharedBookingRepo.createQueryBuilder("sharedBooking")
                .where("sharedBooking.bookingId = :bookingId", { bookingId: bookingId })
                .andWhere("sharedBooking.isCancelled = :isCancelled", { isCancelled: false })
                .andWhere("sharedBooking.advancePaymentId IS NOT NULL")
                .getOne();
            if (sharedBooking) {
                resp.firstLong = booking.startLong;
                resp.firstLat = booking.startLat;
                resp.secondLong = sharedBooking.startLong;
                resp.secondLat = sharedBooking.startLat;
                resp.thirdLong = sharedBooking.destLong;
                resp.thirdLat = sharedBooking.destLat;
                resp.fourthLong = booking.destLong;
                resp.fourthLat = booking.destLat;
            }
            else {
                resp.firstLong = booking.startLong;
                resp.firstLat = booking.startLat;
                resp.secondLong = booking.destLong;
                resp.secondLat = booking.destLat;
            }
        }
        else {
            const sharedBooking = await this.sharedBookingRepo.findOne({
                where: {
                    id: bookingId
                },
                relations: ["booking"]
            });
            if (sharedBooking.booking.isCancelled) {
                resp.firstLong = sharedBooking.startLong;
                resp.firstLat = sharedBooking.startLat;
                resp.secondLong = sharedBooking.destLong;
                resp.secondLat = sharedBooking.destLat;
            }
            else {
                resp.firstLong = sharedBooking.booking.startLong;
                resp.firstLat = sharedBooking.booking.startLat;
                resp.secondLong = sharedBooking.startLong;
                resp.secondLat = sharedBooking.startLat;
                resp.thirdLong = sharedBooking.destLong;
                resp.thirdLat = sharedBooking.destLat;
                resp.fourthLong = sharedBooking.booking.startLong;
                resp.fourthLat = sharedBooking.booking.startLat;
            }
        }
        return resp;
    }
    async updateBookingLoadingTime(id, time) {
        const booking = await this.repo.findOne({
            where: {
                id: id,
            },
        });
        booking.loadingTime = time;
        return await this.repo.save(booking);
    }
    async updateBookingUnloadingTime(bookingId, time) {
        const booking = await this.repo.findOne({
            where: {
                id: bookingId,
            },
            relations: ['advancePayment']
        });
        const sharedBooking = await this.sharedBookingRepo
            .createQueryBuilder('sharedBooking')
            .leftJoinAndSelect('sharedBooking.advancePayment', 'advancePayment')
            .where('sharedBooking.bookingId = :bookingId', { bookingId: booking.id })
            .andWhere('sharedBooking.isCancelled = :isCancelled', { isCancelled: false })
            .andWhere('sharedBooking.advancePaymentId IS NOT NULL')
            .getOne();
        const resp = new bookingComplete_res_1.BookingCompleteRes();
        resp.vehicleCharge = parseFloat(booking.vehicleCharge.toFixed(2));
        resp.serviceCharge = parseFloat(booking.serviceCharge.toFixed(2));
        resp.handlingCharge = parseFloat(((booking.loadingTime / 60 + time / 60) * 3).toFixed(2));
        resp.total = parseFloat((booking.vehicleCharge + booking.serviceCharge + resp.handlingCharge).toFixed(2));
        resp.advancePayment = parseFloat(booking.advancePayment.amount.toFixed(2));
        if (sharedBooking) {
            resp.balPayment = parseFloat((booking.vehicleCharge * booking.loadingCapacity + booking.serviceCharge + resp.handlingCharge - booking.advancePayment.amount).toFixed(2));
            resp.sharedDiscount = ((1 - booking.loadingCapacity) * 100).toFixed(2) + '%';
        }
        else {
            resp.balPayment = parseFloat((booking.vehicleCharge + booking.serviceCharge + resp.handlingCharge - booking.advancePayment.amount).toFixed(2));
            resp.sharedDiscount = '0%';
        }
        booking.unloadingTime = time;
        await this.repo.save(booking);
        return resp;
    }
    async updateSharedBookingLoadingTime(id, time) {
        const booking = await this.sharedBookingRepo.findOne({
            where: {
                id: id,
            },
        });
        booking.loadingTime = time;
        return await this.sharedBookingRepo.save(booking);
    }
    async updateSharedBookingUnloadingTime(id, time) {
        const sharedBooking = await this.sharedBookingRepo.findOne({
            where: {
                id: id,
            },
            relations: ['booking', 'advancePayment']
        });
        const resp = new bookingComplete_res_1.BookingCompleteRes();
        resp.vehicleCharge = parseFloat(sharedBooking.vehicleCharge.toFixed(2));
        resp.serviceCharge = parseFloat(sharedBooking.serviceCharge.toFixed(2));
        resp.handlingCharge = parseFloat(((sharedBooking.loadingTime / 60 + time / 60) * 3).toFixed(2));
        resp.total = parseFloat((sharedBooking.vehicleCharge + sharedBooking.serviceCharge + resp.handlingCharge).toFixed(2));
        resp.advancePayment = parseFloat((sharedBooking.advancePayment.amount).toFixed(2));
        if (sharedBooking.booking.isCancelled) {
            resp.total = parseFloat((sharedBooking.vehicleCharge + sharedBooking.serviceCharge + resp.handlingCharge - sharedBooking.advancePayment.amount)
                .toFixed(2));
            resp.sharedDiscount = '0%';
        }
        else {
            resp.balPayment = parseFloat((sharedBooking.vehicleCharge * (1 - sharedBooking.booking.loadingCapacity) +
                sharedBooking.serviceCharge + resp.handlingCharge - sharedBooking.advancePayment.amount)
                .toFixed(2));
            resp.sharedDiscount = (sharedBooking.booking.loadingCapacity * 100).toFixed(2) + '%';
        }
        sharedBooking.unloadingTime = time;
        await this.sharedBookingRepo.save(sharedBooking);
        return resp;
    }
    async getOriginalCancelledShared(customerId) {
        const bookings = await this.repo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.sharedBooking', 'sharedBookings')
            .leftJoinAndSelect('booking.vehicle', 'vehicle')
            .leftJoinAndSelect('sharedBookings.customer', 'customer')
            .leftJoinAndSelect('booking.balPayment', 'balPayment')
            .leftJoinAndSelect('balPayment.driver', 'driver')
            .where('booking.isCancelled = :cancelled', { cancelled: true })
            .andWhere('booking.status = :status', { status: 'cancelled' })
            .getMany();
        const sharedBookings = [];
        if (bookings.length !== 0) {
            for (const booking of bookings) {
                for (const sBooking of booking.sharedBooking) {
                    if (sBooking.customer.id === customerId) {
                        const res = {};
                        res.id = sBooking.id;
                        res.createdAt = booking.createdAt;
                        res.bookingDate = booking.bookingDate;
                        res.pickupTime = booking.pickupTime;
                        res.startLong = sBooking.startLong;
                        res.startLat = sBooking.startLat;
                        res.destLong = sBooking.destLong;
                        res.destLat = sBooking.destLat;
                        res.loadingTime = sBooking.loadingTime;
                        res.unloadingTime = sBooking.unloadingTime;
                        res.travellingTime = sBooking.travellingTime;
                        res.vehicleCharge = sBooking.vehicleCharge;
                        res.loadingCapacity = 1 - booking.loadingCapacity;
                        res.isReturnTrip = false;
                        res.willingToShare = false;
                        res.isCancelled = booking.isCancelled;
                        res.type = 'shared';
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
                        if (sBooking.status === 'complete') {
                            const driverObj = {};
                            driverObj.id = booking.balPayment.driver.id;
                            driverObj.firstName = booking.balPayment.driver.firstName;
                            driverObj.lastName = booking.balPayment.driver.lastName;
                            res.driver = driverObj;
                        }
                        sharedBookings.push(res);
                    }
                }
            }
        }
        return sharedBookings;
    }
    async recordBalPayment(paymentReq, bookingId) {
        let booking;
        if (paymentReq.bookingType === 'original') {
            booking = await this.repo.findOne({
                where: {
                    id: bookingId
                },
                relations: ["vehicle.owner", "vehicle.driverVehicle", "customer"]
            });
        }
        else {
            booking = await this.sharedBookingRepo.findOne({
                where: {
                    id: bookingId
                },
                relations: ["booking.vehicle.owner", "booking.vehicle.driverVehicle", "customer"]
            });
        }
        const assignDriver = await this.driverVehiRepo.createQueryBuilder('driverVehi')
            .leftJoinAndSelect('driverVehi.driver', 'driver')
            .leftJoinAndSelect('driver.owner', 'owner')
            .where('driverVehi.vehicleId = :vehicleId', {
            vehicleId: booking instanceof booking_entity_1.Booking ?
                booking.vehicle.id
                :
                    booking.booking.vehicle.id
        })
            .andWhere('driverVehi.removedDate IS NULL')
            .getOne();
        const payment = new balPayment_entity_1.BalPayment();
        payment.date = new Date();
        payment.stripeId = paymentReq.stripeId;
        payment.amount = paymentReq.balPayment;
        payment.driver = assignDriver.driver;
        const balPayment = await this.balPaymentRepo.save(payment);
        booking.balPayment = balPayment;
        booking.status = 'complete';
        if (booking instanceof booking_entity_1.Booking) {
            await this.repo.save(booking);
        }
        else {
            await this.sharedBookingRepo.save(booking);
        }
        const updatedWallet = await this.updateWallet(booking instanceof booking_entity_1.Booking ?
            booking.vehicle.owner
            :
                booking.booking.vehicle.owner, paymentReq.balPayment);
        await this.recordOwnerTransaction(paymentReq.serviceCharge, booking, updatedWallet);
        await this.recordServiceCharge(paymentReq.serviceCharge, booking);
        let reward = new customerRewards_entity_1.CustomerRewards();
        if (paymentReq.rewardId !== "") {
            reward = await this.customerRewardsRepo.findOne({
                where: {
                    id: paymentReq.rewardId
                }
            });
            reward.isClaimed = true;
            reward.balPayment = balPayment;
            await this.customerRewardsRepo.save(reward);
        }
        const today = new Date();
        const threeMonthsBack = new Date();
        threeMonthsBack.setMonth(today.getMonth() - 3);
        const originalBookingCount = await this.repo.createQueryBuilder("booking")
            .where("booking.customerId = :customerId", { customerId: booking.customer.id })
            .andWhere("booking.bookingDate BETWEEN :startDate AND :endDate", { startDate: threeMonthsBack, endDate: today })
            .andWhere("booking.status = :status", { status: "complete" })
            .getCount();
        const sharedBookingCount = await this.sharedBookingRepo.createQueryBuilder("sharedBooking")
            .leftJoinAndSelect("sharedBooking.booking", "booking")
            .where("sharedBooking.customerId = :customerId", { customerId: booking.customer.id })
            .andWhere("sharedBooking.status = :status", { status: "complete" })
            .andWhere("booking.bookingDate BETWEEN :startDate AND :endDate", { startDate: threeMonthsBack, endDate: today })
            .getCount();
        let newBookings = originalBookingCount + sharedBookingCount;
        if (newBookings >= 10) {
            const rewards = await this.customerRewardsRepo.createQueryBuilder("cusRewards")
                .where("cusRewards.customerId = :customerId", { customerId: booking.customer.id })
                .andWhere("cusRewards.date BETWEEN :startDate AND :endDate", { startDate: threeMonthsBack, endDate: today })
                .getMany();
            if (rewards.length === 0) {
                const newReward = new customerRewards_entity_1.CustomerRewards();
                newReward.date = new Date();
                newReward.reward = 0.05;
                newReward.customer = booking.customer;
                newReward.balPayment = balPayment;
                await this.customerRewardsRepo.save(newReward);
            }
        }
        const oneMonthBack = new Date();
        oneMonthBack.setMonth(today.getMonth() - 1);
        const ownerBookingCount = await this.repo.createQueryBuilder("booking")
            .leftJoinAndSelect("booking.vehicle", "vehicle")
            .leftJoinAndSelect("vehicle.owner", "owner")
            .leftJoinAndSelect("booking.balPayment", "balPayment")
            .where("booking.bookingDate BETWEEN :startDate AND :endDate", { startDate: oneMonthBack, endDate: today })
            .andWhere("booking.status = :status", { status: "complete" })
            .andWhere("owner.id = :ownerId", {
            ownerId: booking instanceof booking_entity_1.Booking ?
                booking.vehicle.owner.id
                :
                    booking.booking.vehicle.owner.id
        })
            .getMany();
        const ownerSharedBookingCount = await this.sharedBookingRepo.createQueryBuilder("sharedBooking")
            .leftJoinAndSelect("sharedBooking.booking", "booking")
            .leftJoinAndSelect("booking.vehicle", "vehicle")
            .leftJoinAndSelect("vehicle.owner", "owner")
            .leftJoinAndSelect("sharedBooking.balPayment", "balPayment")
            .where("booking.bookingDate BETWEEN :startDate AND :endDate", { startDate: oneMonthBack, endDate: today })
            .andWhere("sharedBooking.status = :status", { status: "complete" })
            .andWhere("owner.id = :ownerId", {
            ownerId: booking instanceof booking_entity_1.Booking ?
                booking.vehicle.owner.id
                :
                    booking.booking.vehicle.owner.id
        })
            .getMany();
        const totalCount = ownerBookingCount.length + ownerSharedBookingCount.length;
        if (totalCount >= 20) {
            const rewards = await this.ownerRewardsRepo.createQueryBuilder("ownerRewards")
                .where("ownerRewards.ownerId = :ownerId", {
                ownerId: booking instanceof booking_entity_1.Booking ?
                    booking.vehicle.owner.id
                    :
                        booking.booking.vehicle.owner.id
            })
                .andWhere("ownerRewards.date BETWEEN :startDate AND :endDate", { startDate: oneMonthBack, endDate: today })
                .getMany();
            if (rewards.length === 0) {
                let totalEarned = 0;
                if (ownerBookingCount.length !== 0) {
                    for (const b of ownerBookingCount) {
                        totalEarned += b.balPayment.amount;
                    }
                }
                if (ownerSharedBookingCount.length !== 0) {
                    for (const s of ownerSharedBookingCount) {
                        totalEarned += s.balPayment.amount;
                    }
                }
                const newReward = new ownerRewards_entity_1.OwnerRewards();
                newReward.date = new Date();
                newReward.rewardAmount = totalEarned * 0.05;
                newReward.owner = booking instanceof booking_entity_1.Booking ? booking.vehicle.owner : booking.booking.vehicle.owner;
                await this.ownerRewardsRepo.save(newReward);
            }
        }
        const notification = new notification_req_1.NotificationReq();
        notification.timeStamp = new Date();
        notification.title = "Booking Completed!";
        notification.message = `Customer made the balance payment for booking id ${booking instanceof booking_entity_1.Booking ? booking.id : booking.booking.id}`;
        notification.userId = booking instanceof booking_entity_1.Booking ? booking.vehicle.owner.id : booking.booking.vehicle.owner.id;
        await this.notifications.sendOwnerNotification(notification);
        notification.message = `Customer made the balance payment for booking id ${booking instanceof booking_entity_1.Booking ? booking.id : booking.booking.id}`;
        notification.userId = assignDriver.id;
        await this.notifications.sendDriverNotification(notification);
        notification.message = "Your booking has been completed!";
        notification.userId = booking.customer.id;
        await this.notifications.sendCustomerNotification(notification);
        return { bookingId: balPayment.id, booking: booking };
    }
    async makeRateReview(rateReviewReq, customerId) {
        const customer = await this.customerRepo.findOne({
            where: {
                id: customerId
            }
        });
        let booking;
        if (rateReviewReq.bookingType === "original") {
            booking = await this.repo.findOne({
                where: {
                    id: rateReviewReq.bookingId
                },
            });
        }
        else {
            booking = await this.sharedBookingRepo.findOne({
                where: {
                    id: rateReviewReq.bookingId
                },
            });
        }
        const driver = await this.driverRepo.findOne({
            where: {
                id: rateReviewReq.driverId
            }
        });
        const rateReview = new rateReview_entity_1.RateReview();
        rateReview.date = new Date();
        rateReview.rate = rateReviewReq.rate;
        rateReview.review = rateReviewReq.review;
        if (booking instanceof booking_entity_1.Booking) {
            rateReview.booking = booking;
        }
        else {
            rateReview.sharedBooking = booking;
        }
        rateReview.driver = driver;
        rateReview.customer = customer;
        return await this.rateReviewRepo.save(rateReview);
    }
    async getOwner(bookingId, type) {
        if (type === 'original') {
            const booking = await this.repo.findOne({
                where: {
                    id: bookingId
                },
                relations: ["vehicle.owner"]
            });
            return booking.vehicle.owner;
        }
        const sharedBooking = await this.sharedBookingRepo.findOne({
            where: {
                id: bookingId
            },
            relations: ["booking.vehicle.owner"]
        });
        return sharedBooking.booking.vehicle.owner;
    }
    async getUpcomingDriver(bookingId, type) {
        if (type === 'original') {
            const booking = await this.repo.createQueryBuilder("booking")
                .leftJoinAndSelect("booking.vehicle", "vehicle")
                .leftJoinAndSelect("vehicle.driverVehicle", "driverVehi")
                .leftJoinAndSelect("driverVehi.driver", "driver")
                .where("booking.id = :id", { id: bookingId })
                .andWhere("driverVehi.removedDate IS NULL")
                .getOne();
            return booking.vehicle.driverVehicle[0].driver;
        }
        const sBooking = await this.sharedBookingRepo.createQueryBuilder("sBooking")
            .leftJoinAndSelect("sBooking.booking", "booking")
            .leftJoinAndSelect("booking.vehicle", "vehicle")
            .leftJoinAndSelect("vehicle.driverVehicle", "driverVehi")
            .leftJoinAndSelect("driverVehi.driver", "driver")
            .where("sBooking.id = :id", { id: bookingId })
            .andWhere("driverVehi.removedDate IS NULL")
            .getOne();
        return sBooking.booking.vehicle.driverVehicle[0].driver;
    }
    async getCompletedDriver(bookingId, type) {
        if (type === 'original') {
            const booking = await this.repo.findOne({
                where: {
                    id: bookingId
                },
                relations: ["balPayment.driver"]
            });
            return booking.balPayment.driver;
        }
        const sBooking = await this.sharedBookingRepo.findOne({
            where: {
                id: bookingId
            },
            relations: ["balPayment.driver"]
        });
        return sBooking.balPayment.driver;
    }
    async getCustomer(bookingId, type) {
        if (type === 'original') {
            const booking = await this.repo.findOne({
                where: {
                    id: bookingId
                },
                relations: ['customer']
            });
            return booking.customer;
        }
        const sBooking = await this.sharedBookingRepo.findOne({
            where: {
                id: bookingId
            },
            relations: ['customer']
        });
        return sBooking.customer;
    }
    async getRateReview(bookingId, type) {
        if (type === 'original') {
            return await this.rateReviewRepo.createQueryBuilder("rate")
                .where("rate.bookingId = :bookingId", { bookingId: bookingId })
                .getOne();
        }
        return await this.rateReviewRepo.createQueryBuilder("rate")
            .where("rate.sharedBookingId = :bookingId", { bookingId: bookingId })
            .getOne();
    }
    async getVehicle(bookingId, type) {
        if (type === 'original') {
            const booking = await this.repo.findOne({
                where: {
                    id: bookingId
                },
                relations: ["vehicle"]
            });
            return booking.vehicle;
        }
        const sharedBooking = await this.sharedBookingRepo.findOne({
            where: {
                id: bookingId
            },
            relations: ["booking.vehicle"]
        });
        return sharedBooking.booking.vehicle;
    }
    async getBookingsCount() {
        const originalUpcoming = await this.repo.count({
            where: {
                status: 'upcoming'
            }
        });
        const originalCompleted = await this.repo.count({
            where: {
                status: 'complete'
            }
        });
        const originalCancelled = await this.repo.count({
            where: {
                status: 'cancelled'
            }
        });
        const sharedUpcoming = await this.sharedBookingRepo.count({
            where: {
                status: 'upcoming'
            }
        });
        const sharedCompleted = await this.sharedBookingRepo.count({
            where: {
                status: 'complete'
            }
        });
        const sharedCancelled = await this.sharedBookingRepo.count({
            where: {
                status: 'cancelled'
            }
        });
        const countRes = new bookingCount_res_1.BookingCountRes();
        countRes.originalUpcoming = originalUpcoming;
        countRes.originalCompleted = originalCompleted;
        countRes.originalCancelled = originalCancelled;
        countRes.totalOriginal = originalUpcoming + originalCompleted + originalCancelled;
        countRes.sharedUpcoming = sharedUpcoming;
        countRes.sharedCompleted = sharedCompleted;
        countRes.sharedCancelled = sharedCancelled;
        countRes.totalShared = sharedUpcoming + sharedCompleted + sharedCancelled;
        countRes.total = countRes.totalOriginal + countRes.totalShared;
        return countRes;
    }
    async getCancelledReason(bookingId, type) {
        const cancelledReason = new cancelledReason_res_1.CancelledReasonRes();
        if (type === 'original') {
            const reason = await this.bookingCancelRepo.createQueryBuilder("cancel")
                .where("cancel.bookingId = :bookingId", { bookingId: bookingId })
                .getOne();
            cancelledReason.id = reason.id;
            cancelledReason.date = reason.date;
            cancelledReason.reason = reason.reason;
            return cancelledReason;
        }
        const reason = await this.sharedBookingCancelRepo.createQueryBuilder("cancel")
            .where("cancel.bookingId = :bookingId", { bookingId: bookingId })
            .getOne();
        cancelledReason.id = reason.id;
        cancelledReason.date = reason.date;
        cancelledReason.reason = reason.reason;
        return cancelledReason;
    }
    async getServiceCharges() {
        const serviceCharges = await this.serviceChargeRepo.find({
            relations: ["booking", "sharedBooking"]
        });
        const response = [];
        if (serviceCharges.length !== 0) {
            for (const s of serviceCharges) {
                const respObj = {};
                respObj.id = s.id;
                respObj.date = s.date;
                respObj.amount = s.amount;
                respObj.type = s.type;
                if (s.booking) {
                    respObj.bookingType = 'original';
                }
                else {
                    respObj.bookingType = 'shared';
                }
                response.push(respObj);
            }
        }
        return response;
    }
    async getRewards() {
        const response = {
            ownerRewards: [],
            CustomerRewards: []
        };
        const ownerRewards = await this.ownerRewardsRepo.find({
            relations: ["owner"]
        });
        if (ownerRewards.length !== 0) {
            for (const r of ownerRewards) {
                const rewardObj = {};
                rewardObj.id = r.id;
                rewardObj.data = r.date;
                rewardObj.isClaimed = r.isClaimed;
                rewardObj.amount = parseFloat(r.rewardAmount.toFixed(2));
                rewardObj.ownerId = r.owner.id;
                response.ownerRewards.push(rewardObj);
            }
        }
        const cusRewards = await this.customerRewardsRepo.find({
            relations: ["balPayment", "customer"]
        });
        if (cusRewards.length !== 0) {
            for (const r of cusRewards) {
                const rewardObj = {};
                rewardObj.id = r.id;
                rewardObj.date = r.date;
                rewardObj.isClaimed = r.isClaimed;
                rewardObj.rewardPercentage = r.reward * 100 + '%';
                rewardObj.rewardAmount = 0;
                rewardObj.customerId = r.customer.id;
                if (r.isClaimed) {
                    rewardObj.rewardAmount = parseFloat(((r.balPayment.amount / (1 - r.reward)) * r.reward).toFixed(2));
                }
                response.CustomerRewards.push(rewardObj);
            }
        }
        return response;
    }
    async getBookingData(bookingId, type) {
        if (type === 'original') {
            const booking = await this.repo.findOne({
                where: {
                    id: bookingId
                },
                relations: ["sharedBooking"]
            });
            const bookingRes = new booking_res_1.BookingRes();
            bookingRes.id = booking.id;
            bookingRes.createdAt = booking.createdAt;
            bookingRes.bookingDate = booking.bookingDate;
            bookingRes.pickupTime = booking.pickupTime;
            bookingRes.loadingTime = booking.loadingTime;
            bookingRes.unloadingTime = booking.unloadingTime;
            bookingRes.startLong = booking.startLong;
            bookingRes.startLat = booking.startLat;
            bookingRes.destLong = booking.destLong;
            bookingRes.destLat = booking.destLat;
            bookingRes.travellingTime = booking.travellingTime;
            bookingRes.vehicleCharge = booking.vehicleCharge;
            bookingRes.serviceCharge = booking.serviceCharge;
            bookingRes.handlingCharge = booking.handlingCharge;
            bookingRes.loadingCapacity = booking.loadingCapacity;
            bookingRes.isReturnTrip = booking.isReturnTrip;
            bookingRes.willingToShare = booking.willingToShare;
            bookingRes.avgHandlingTime = booking.avgHandlingTime;
            bookingRes.status = booking.status;
            bookingRes.isCancelled = booking.isCancelled;
            if (booking.sharedBooking.length !== 0) {
                for (const sBooking of booking.sharedBooking) {
                    if (sBooking.status !== 'cancelled') {
                        bookingRes.sharedBookingId = sBooking.id;
                    }
                }
            }
            return bookingRes;
        }
        const sBooking = await this.sharedBookingRepo.findOne({
            where: {
                id: bookingId
            },
            relations: ["booking"]
        });
        const bookingRes = new sharedBooking_res_1.SharedBookingRes();
        bookingRes.id = sBooking.id;
        bookingRes.bookingDate = sBooking.booking.bookingDate;
        bookingRes.loadingTime = sBooking.loadingTime;
        bookingRes.unloadingTime = sBooking.unloadingTime;
        bookingRes.startLong = sBooking.startLong;
        bookingRes.startLat = sBooking.startLat;
        bookingRes.destLong = sBooking.destLong;
        bookingRes.destLat = sBooking.destLat;
        bookingRes.travellingTime = sBooking.travellingTime;
        bookingRes.vehicleCharge = sBooking.vehicleCharge;
        bookingRes.serviceCharge = sBooking.serviceCharge;
        bookingRes.loadingCapacity = 1 - sBooking.booking.loadingCapacity;
        bookingRes.avgHandlingTime = sBooking.avgHandlingTime;
        bookingRes.status = sBooking.status;
        bookingRes.isCancelled = sBooking.isCancelled;
        bookingRes.bookingId = sBooking.booking.id;
        return bookingRes;
    }
    async getPaymentHistory(customerId) {
        const bookings = await this.repo.createQueryBuilder("booking")
            .leftJoinAndSelect("booking.balPayment", "balPayment")
            .leftJoinAndSelect("booking.advancePayment", "advancePayment")
            .where("booking.customerId = :customerId", { customerId: customerId })
            .getMany();
        const response = [];
        if (bookings.length !== 0) {
            for (const b of bookings) {
                const paymentObj = new paymentHistory_res_1.PaymentHistoryRes();
                if (b.advancePayment) {
                    paymentObj.advancePaymentId = b.advancePayment.id;
                    paymentObj.advancePaymentDate = b.advancePayment.date;
                    paymentObj.advancePaymentAmount = b.advancePayment.amount;
                    paymentObj.total = b.advancePayment.amount;
                }
                if (b.balPayment) {
                    paymentObj.balPaymentId = b.balPayment.id;
                    paymentObj.balPaymentDate = b.balPayment.date;
                    paymentObj.balPaymentAmount = b.balPayment.amount;
                    paymentObj.total += b.balPayment.amount;
                }
                if (b.advancePayment || b.balPayment) {
                    response.push(paymentObj);
                }
            }
        }
        return response;
    }
    async getDriversBookingCount(ownerId) {
        const drivers = await this.driverRepo.createQueryBuilder("driver")
            .where("driver.ownerId = :ownerId", { ownerId: ownerId })
            .getMany();
        const balPayments = await this.balPaymentRepo.find({
            relations: ["driver"]
        });
        const response = [];
        if (drivers.length !== 0) {
            for (const d of drivers) {
                const driverCount = new driversBookingCount_res_1.DriversBookingCountRes();
                driverCount.driverId = d.id;
                driverCount.firstName = d.firstName;
                driverCount.lastName = d.lastName;
                const count = balPayments.filter((payment) => payment.driver.id === d.id);
                driverCount.bookingCount = count.length;
                response.push(driverCount);
            }
        }
        return response;
    }
    async getReturnTrips() {
        const response = [];
        return await this.repo.find({
            where: {
                isReturnTrip: false,
                status: 'upcoming'
            },
            relations: ["vehicle", "sharedBooking"]
        });
    }
    async getOwnerRates(ownerId) {
        const drivers = await this.driverRepo.createQueryBuilder("driver")
            .where("driver.ownerId = :ownerId", { ownerId: ownerId })
            .getMany();
        const rates = await this.rateReviewRepo.find({
            relations: ["driver"]
        });
        let count = 0;
        let totalRates = 0;
        if (drivers.length !== 0) {
            for (const d of drivers) {
                const index = rates.findIndex((rates) => rates.driver.id === d.id);
                if (index !== -1) {
                    totalRates += rates[index].rate;
                    count++;
                }
            }
        }
        if (totalRates === 0) {
            return 0;
        }
        return totalRates / count;
    }
    async getBalancePaymentPendings(customerId) {
        const response = new allBookings_res_1.AllBookingsRes();
        const originals = await this.repo.createQueryBuilder("booking")
            .where("booking.customerId = :customerId", { customerId: customerId })
            .andWhere("booking.unloadingTime != 0")
            .andWhere("booking.balPayment IS NULL")
            .getMany();
        if (originals.length !== 0) {
            const orgBookings = [];
            for (const b of originals) {
                const obj = new booking_res_2.OrgBookingRes();
                obj.id = b.id;
                obj.bookingDate = b.bookingDate;
                obj.pickupTime = b.pickupTime;
                obj.loadingTime = b.loadingTime / 60;
                obj.unloadingTime = b.unloadingTime / 60;
                obj.startLong = b.startLong;
                obj.startLat = b.startLat;
                obj.destLong = b.destLong;
                obj.destLat = b.destLat;
                obj.travellingTime = b.travellingTime;
                obj.loadingCapacity = b.loadingCapacity;
                obj.isReturnTrip = b.isReturnTrip;
                obj.willingToShare = b.willingToShare;
                obj.type = "original";
                orgBookings.push(obj);
            }
            response.original = orgBookings;
        }
        const shared = await this.sharedBookingRepo.createQueryBuilder("sBooking")
            .leftJoinAndSelect("sBooking.booking", "booking")
            .where("sBooking.customerId = :customerId", { customerId: customerId })
            .andWhere("sBooking.unloadingTime != 0")
            .andWhere("sBooking.balPayment IS NULL")
            .getMany();
        if (shared.length !== 0) {
            const sharedBookings = [];
            for (const b of shared) {
                const obj = new sharedBooking_res_2.CusSharedBookingRes();
                obj.id = b.id;
                obj.bookingDate = b.booking.bookingDate;
                obj.loadingTime = b.loadingTime / 60;
                obj.unloadingTime = b.unloadingTime / 60;
                obj.startLong = b.startLong;
                obj.startLat = b.startLat;
                obj.destLong = b.destLong;
                obj.destLat = b.destLat;
                obj.travellingTime = b.travellingTime;
                obj.loadingCapacitiy = 1 - b.booking.loadingCapacity;
                obj.type = "shared";
                sharedBookings.push(obj);
            }
            response.shared = sharedBookings;
        }
        return response;
    }
    async recordServiceCharge(amount, booking, type) {
        const serviceCharge = new serviceCharge_entity_1.ServiceCharge;
        serviceCharge.date = new Date();
        serviceCharge.amount = amount;
        if (booking instanceof booking_entity_1.Booking) {
            serviceCharge.booking = booking;
        }
        else {
            serviceCharge.sharedBooking = booking;
        }
        serviceCharge.type = type;
        await this.serviceChargeRepo.save(serviceCharge);
        return;
    }
    async recordOwnerTransaction(amount, booking, wallet) {
        const ownerCredit = new ownerCredit_entity_1.OwnerCredit;
        ownerCredit.date = new Date();
        ownerCredit.amount = amount;
        if (booking instanceof booking_entity_1.Booking) {
            ownerCredit.booking = booking;
        }
        else {
            ownerCredit.sharedBooking = booking;
        }
        ownerCredit.wallet = wallet;
        await this.ownerCreditRepo.save(ownerCredit);
        return;
    }
    async updateWallet(owner, amount) {
        const wallet = await this.ownerWalletRepo.createQueryBuilder('wallet')
            .where('wallet.ownerId = :ownerId', { ownerId: owner.id })
            .getOne();
        let updatedWallet = new ownerWallet_entity_1.OwnerWallet();
        if (wallet) {
            wallet.earnings = wallet.earnings + amount;
            updatedWallet = await this.ownerWalletRepo.save(wallet);
        }
        else {
            updatedWallet.earnings = amount;
            updatedWallet.owner = owner;
            updatedWallet = await this.ownerWalletRepo.save(updatedWallet);
        }
        return updatedWallet;
    }
    async getNearbyCities(startLat, startLong, endLat, endLong) {
        const resp = await client.directions({
            params: {
                origin: `${startLat}, ${startLong}`,
                destination: `${endLat}, ${endLong}`,
                mode: google_maps_services_js_1.TravelMode.driving,
                key: process.env.MAP_API,
            },
        });
        const cities = [];
        if (resp.data.routes.length !== 0) {
            for (const route of resp.data.routes) {
                for (const leg of route.legs) {
                    for (const step of leg.steps) {
                        const { lat, lng } = step.end_location;
                        const city = await this.getCitiesFromCoord(lat, lng);
                        if (city && !cities.includes(city)) {
                            cities.push(city);
                        }
                    }
                }
            }
        }
        return cities;
    }
    async getCitiesFromCoord(lat, long) {
        const client = new google_maps_services_js_1.Client();
        const resp = await client.reverseGeocode({
            params: {
                latlng: `${lat}, ${long}`,
                key: process.env.MAP_API,
            },
        });
        if (resp.data.results.length !== 0) {
            for (const result of resp.data.results) {
                for (const component of result.address_components) {
                    if (component.types.includes(google_maps_services_js_1.AddressType.locality)) {
                        return component.long_name;
                    }
                }
            }
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(driver_vehicle_entity_1.DriverVehicle)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(4, (0, typeorm_1.InjectRepository)(advancePayment_entity_1.AdvancePayment)),
    __param(5, (0, typeorm_1.InjectRepository)(ownerCredit_entity_1.OwnerCredit)),
    __param(6, (0, typeorm_1.InjectRepository)(ownerWallet_entity_1.OwnerWallet)),
    __param(7, (0, typeorm_1.InjectRepository)(bookingCancel_entity_1.BookingCancel)),
    __param(8, (0, typeorm_1.InjectRepository)(sharedBooking_entity_1.SharedBooking)),
    __param(9, (0, typeorm_1.InjectRepository)(sharedBookingCancel_entity_1.SharedBookingCancel)),
    __param(10, (0, typeorm_1.InjectRepository)(balPayment_entity_1.BalPayment)),
    __param(11, (0, typeorm_1.InjectRepository)(serviceCharge_entity_1.ServiceCharge)),
    __param(12, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(13, (0, typeorm_1.InjectRepository)(rateReview_entity_1.RateReview)),
    __param(14, (0, typeorm_1.InjectRepository)(ownerRewards_entity_1.OwnerRewards)),
    __param(15, (0, typeorm_1.InjectRepository)(customerRewards_entity_1.CustomerRewards)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notification_gateway_1.NotificationGateway])
], BookingService);
//# sourceMappingURL=booking.service.js.map