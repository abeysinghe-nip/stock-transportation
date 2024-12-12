import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './enities/booking.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { BookingDto } from './dtos/booking.dto';
import { DriverVehicle } from 'src/driver/entities/driver.vehicle.entity';
import * as moment from 'moment';
import { Customer } from 'src/customer/entities/customer.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { ChargesRes } from 'src/customer/responses/charges.res';
import * as st from 'stripe';
import { IntentReq } from 'src/customer/requests/intent.req';
import { IntentRes } from 'src/customer/responses/intent.res';
import { BookingCancelDto } from './dtos/bookingCancel.dto';
import { PaymentDto } from './dtos/payment.dto';
import { AdvancePayment } from './enities/advancePayment.entity';
import { CommonRes } from 'src/common/responses/common.res';
import { OwnerCredit } from 'src/owner/entities/ownerCredit.entity';
import { OwnerWallet } from 'src/owner/entities/ownerWallet.entity';
import { BookingCancel } from './enities/bookingCancel.entity';
import { AddressType, Client, TravelMode } from '@googlemaps/google-maps-services-js';
import { CalChargeReq } from 'src/customer/requests/calCharge.req';
import { SharedBookingReq } from 'src/customer/requests/sharedBooking.req';
import { SharedBooking } from './enities/sharedBooking.entity';
import { SharedBookingCancel } from './enities/sharedBookingCancel.entity';
import { BookingCompleteRes } from '../driver/responses/bookingComplete.res';
import { CoordinatesRes } from 'src/driver/responses/coordinates.res';
import { BalPaymentReq } from 'src/customer/requests/balPayment.req';
import { BalPayment } from './enities/balPayment.entity';
import { ServiceCharge } from './enities/serviceCharge.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { RateReviewReq } from 'src/customer/requests/rateReview.req';
import { RateReview } from './enities/rateReview.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { OwnerRewards } from 'src/owner/entities/ownerRewards.entity';
import { CustomerRewards } from 'src/customer/entities/customerRewards.entity';
import { BookingCountRes } from 'src/admin/responses/bookingCount.res';
import { CancelledReasonRes } from 'src/common/responses/cancelledReason.res';
import { SharedBookingRes } from 'src/common/responses/sharedBooking.res';
import { PaymentHistoryRes } from 'src/customer/responses/paymentHistory.res';
import { DriversBookingCountRes } from 'src/owner/responses/driversBookingCount.res';
import { NotificationGateway } from 'src/gateways/notification.gateway';
import { NotificationReq } from 'src/common/requests/notification.req';
import { AllBookingsRes } from 'src/customer/responses/allBookings.res';
import { BookingRes } from 'src/common/responses/booking.res';
import { OrgBookingRes } from 'src/customer/responses/booking.res';
import { CusSharedBookingRes } from 'src/customer/responses/sharedBooking.res';
require('dotenv').config();

const stripe = new st.Stripe(process.env.STRIPE_SECRET);
const client = new Client();

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private repo: Repository<Booking>,
    @InjectRepository(DriverVehicle)
    private driverVehiRepo: Repository<DriverVehicle>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    @InjectRepository(Vehicle)
    private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(AdvancePayment)
    private paymentRepo: Repository<AdvancePayment>,
    @InjectRepository(OwnerCredit)
    private ownerCreditRepo: Repository<OwnerCredit>,
    @InjectRepository(OwnerWallet)
    private ownerWalletRepo: Repository<OwnerWallet>,
    @InjectRepository(BookingCancel)
    private bookingCancelRepo: Repository<BookingCancel>,
    @InjectRepository(SharedBooking)
    private sharedBookingRepo: Repository<SharedBooking>,
    @InjectRepository(SharedBookingCancel)
    private sharedBookingCancelRepo: Repository<SharedBookingCancel>,
    @InjectRepository(BalPayment)
    private balPaymentRepo: Repository<BalPayment>,
    @InjectRepository(ServiceCharge)
    private serviceChargeRepo: Repository<ServiceCharge>,
    @InjectRepository(Driver)
    private driverRepo: Repository<Driver>,
    @InjectRepository(RateReview)
    private rateReviewRepo: Repository<RateReview>,
    @InjectRepository(OwnerRewards)
    private ownerRewardsRepo: Repository<OwnerRewards>,
    @InjectRepository(CustomerRewards)
    private customerRewardsRepo: Repository<CustomerRewards>,
    private readonly notifications: NotificationGateway,
  ) { }

  //Calculate charges for booking80
  async calCharges(calChargeReq: CalChargeReq): Promise<ChargesRes> {
    const vehicle = await this.vehicleRepo.findOne({
      where: {
        id: calChargeReq.vehicleId,
      },
    });

    let vehicleCharge = Number(vehicle.chargePerKm * calChargeReq.distance);
    if (calChargeReq.retrurnTrip) {
      vehicleCharge = vehicleCharge * 2;
    }
    const chargesRes: ChargesRes = new ChargesRes();
    chargesRes.vehicleCharge = parseFloat(vehicleCharge.toFixed(2));
    chargesRes.serviceCharge = parseFloat(
      ((vehicleCharge * 7) / 100).toFixed(2),
    );
    chargesRes.total = chargesRes.vehicleCharge + chargesRes.serviceCharge;
    chargesRes.advancePayment = (chargesRes.total * 10) / 100;

    return chargesRes;
  }

  //create booking82
  async create(bookingDto: BookingDto): Promise<Booking> {
    const booking: Booking = new Booking();
    const vehicle = await this.vehicleRepo.findOne({
      where: {
        id: bookingDto.vehicleId,
      },
    });

    //Check is another booking available for that vehicle on same time
    const availableBookings = await this.repo.find({
      where: {
        vehicle: vehicle,
        bookingDate: bookingDto.bookingDate,
      },
    });

    if (availableBookings.length !== 0) {
      const bookingStartTime = moment(bookingDto.pickupTime, 'H:mm');
      const bookingTravelTime = bookingDto.travellingTime * 60;
      const bookingEndTime = moment(bookingDto.pickupTime, 'H:mm').add(
        bookingTravelTime + bookingDto.avgHandlingTime,
        'minutes',
      );

      for (const available of availableBookings) {
        if (!available.isCancelled) {
          const startTime = moment(available.pickupTime, 'H:mm');
          const travelTimeInMins = available.travellingTime * 60;
          const handlingTimeInMins = available.avgHandlingTime * 60;

          //Calculate the end time with avarage handling time
          const endTime = moment(available.pickupTime, 'H:mm').add(
            travelTimeInMins + handlingTimeInMins,
            'minutes',
          );

          const isConflict =
            bookingStartTime.isSameOrBefore(endTime) &&
            bookingEndTime.isSameOrAfter(startTime);

          if (isConflict) return booking;
        }

        //Check is shared booking available for that vehicle on same time
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

          const endTime = moment(available.pickupTime, 'H:mm').add(
            travelTimeInMins + handlingTimeInMins,
            'minutes',
          );

          const isConflict =
            bookingStartTime.isSameOrBefore(endTime) &&
            bookingEndTime.isSameOrAfter(startTime);

          if (isConflict) return booking;
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
    } else {
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

    //Send notification to the customer
    const notification: NotificationReq = new NotificationReq();
    notification.timeStamp = new Date();
    notification.title = "Booking Alert!";
    notification.message = "Booking successfully created. Please make the advance payment to confirm";
    notification.userId = customer.id;
    await this.notifications.sendCustomerNotification(notification);

    return await this.repo.save(booking);
  }

  //Get bookings by customer id65 
  async getBookingsCustomer(id: string): Promise<Booking[]> {
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

  //Create payment intent77 
  async createPaymentIntent(intentReq: IntentReq): Promise<IntentRes> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(intentReq.amount) * 100),
      currency: 'lkr',
    });

    const intentRes: IntentRes = new IntentRes();
    intentRes.clientSecret = paymentIntent.client_secret;

    return intentRes;
  }

  //Record advance payment data79 
  async recordPayment(
    bookingId: string,
    type: string,
    paymentDto: PaymentDto,
  ): Promise<CommonRes> {
    const advancePayment: AdvancePayment = new AdvancePayment();
    advancePayment.date = new Date();
    advancePayment.amount = paymentDto.amount;
    advancePayment.stripeId = paymentDto.stripeId;

    const newPayment = await this.paymentRepo.save(advancePayment);

    let booking: Booking | SharedBooking;

    if (paymentDto.type === 'original') {
      booking = await this.repo.findOne({
        where: {
          id: bookingId,
        },
        relations: ['customer', 'vehicle.owner']
      });

      if (type === "return") {
        booking.isReturnTrip = true
      }

      booking.advancePayment = newPayment;

      await this.repo.save(booking);
    } else {
      booking = await this.sharedBookingRepo.findOne({
        where: {
          id: bookingId,
        },
        relations: ['customer', 'booking.vehicle.owner']
      });

      booking.advancePayment = newPayment;

      await this.sharedBookingRepo.save(booking);
    }

    //Send notification to customer
    const notification: NotificationReq = new NotificationReq();
    notification.timeStamp = new Date();
    notification.title = "Payment Alert!";
    notification.message = "You payment has been recorded. Thank you for the confirmation.";
    notification.userId = booking.customer.id;
    await this.notifications.sendCustomerNotification(notification);

    //Send notification to owner
    notification.timeStamp = new Date();
    notification.title = "Booking Alert!";
    notification.message = "You have received new booking! Check in the dashboard";
    notification.userId = booking instanceof Booking ? booking.vehicle.owner.id : booking.booking.vehicle.owner.id;
    await this.notifications.sendOwnerNotification(notification);

    const commonRes: CommonRes = new CommonRes();
    commonRes.id = newPayment.id;
    return commonRes;
  }

  //Cancel booking68 
  async cancelBooking(bookingCancelDto: BookingCancelDto, id: string): Promise<CommonRes> {
    const booking = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['advancePayment', 'vehicle.owner', 'customer'],
    });

    //If paid divide advance payment among owner and service
    if (booking.advancePayment) {
      const ownerCharge = (booking.advancePayment.amount * 30) / 100;

      //Update wallet
      const updatedWallet = await this.updateWallet(booking.vehicle.owner, ownerCharge);

      //Record owner trasction
      await this.recordOwnerTransaction(ownerCharge, booking, updatedWallet);

      //Record service charge
      const amount = (booking.advancePayment.amount * 70) / 100;
      await this.recordServiceCharge(amount, booking, 'cancelled');

      //Send notification to the owner
      const notification: NotificationReq = new NotificationReq();
      notification.timeStamp = new Date();
      notification.title = "Booking Cancellation!";
      notification.message = `The booking on ${booking.bookingDate} has been cancelled by the customer`;
      notification.userId = booking.vehicle.owner.id;
      await this.notifications.sendOwnerNotification(notification);
    }

    booking.isCancelled = true;
    booking.status = 'cancelled';
    await this.repo.save(booking);

    const bookingCancel: BookingCancel = new BookingCancel();
    bookingCancel.date = new Date();
    bookingCancel.reason = bookingCancelDto.reason;
    bookingCancel.booking = booking;

    await this.bookingCancelRepo.save(bookingCancel);

    //Send notification to the customer
    const notification: NotificationReq = new NotificationReq();
    notification.timeStamp = new Date();
    notification.title = "Booking Cancellation!";
    notification.message = "Your booking has been cancelled";
    notification.userId = booking.customer.id;
    await this.notifications.sendCustomerNotification(notification);

    const commonRes: CommonRes = new CommonRes();
    commonRes.id = booking.id;
    return commonRes;
  }

  //Get owner's booking
  async getBookingsByOwner(ownerId: string): Promise<Booking[]> {
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

  //Get shared bookings
  async getSharedBoookings(): Promise<any> {
    const bookings = await this.repo.find({
      where: {
        status: 'upcoming',
        advancePayment: Not(IsNull()),
        isCancelled: false,
        willingToShare: true,
      },

      relations: ['vehicle'],
    });

    const sBookings: any[] = [];

    if (bookings.length !== 0) {
      for (const booking of bookings) {
        booking.id;
        //Check shared booking already exist or not
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
          const sBooking: any = {};
          sBooking.id = booking.id;
          sBooking.bookingDate = booking.bookingDate;
          sBooking.pickupTime = moment(booking.pickupTime, 'H:mm').format('LT');
          sBooking.endTime = moment(booking.pickupTime, 'H:mm')
            .add(booking.travellingTime + booking.avgHandlingTime, 'minutes')
            .format('LT');
          sBooking.loadingCapacity = booking.loadingCapacity;
          sBooking.freeCapacity = 1 - booking.loadingCapacity;
          sBooking.nearbyCities = await this.getNearbyCities(
            booking.startLat,
            booking.startLong,
            booking.destLat,
            booking.destLong,
          );

          const vehicle: any = {};
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

  //Make shared booking
  async makeSharedBooking(sBooking: SharedBookingReq): Promise<SharedBooking> {
    const newBooking: SharedBooking = new SharedBooking();
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

    //Send notification to the customer
    const notification: NotificationReq = new NotificationReq();
    notification.timeStamp = new Date();
    notification.title = "Booking Alert!";
    notification.message = "Booking successfully created. Please make the advance payment to confirm";
    notification.userId = customer.id;
    await this.notifications.sendCustomerNotification(notification);

    return await this.sharedBookingRepo.save(newBooking);
  }

  //Cancell shared bookings
  async cancelSharedBooking(
    bookingCancelDto: BookingCancelDto,
    id: string,
  ): Promise<CommonRes> {
    const booking = await this.sharedBookingRepo.findOne({
      where: {
        id: id,
      },
      relations: ['advancePayment', 'booking.vehicle.owner'],
    });

    //If paid divide advance payment among owner and service
    if (booking.advancePayment) {
      const ownerCharge = (booking.advancePayment.amount * 30) / 100;

      //Update wallet
      const updatedWallet = await this.updateWallet(booking.booking.vehicle.owner, ownerCharge);

      //Record owner trancaction
      await this.recordOwnerTransaction(ownerCharge, booking, updatedWallet);

      //Record service charge
      const amount = (booking.advancePayment.amount * 70) / 100;
      await this.recordServiceCharge(amount, booking, 'cancelled');

      //Send notification to the owner
      const notification: NotificationReq = new NotificationReq();
      notification.timeStamp = new Date();
      notification.title = "Booking Cancellation!";
      notification.message = `The booking on ${booking.booking.bookingDate} has been cancelled by the customer`;
      notification.userId = booking.booking.vehicle.owner.id;
      await this.notifications.sendOwnerNotification(notification);
    }

    booking.isCancelled = true;
    await this.sharedBookingRepo.save(booking);

    const bookingCancel: SharedBookingCancel = new SharedBookingCancel();
    bookingCancel.date = new Date();
    bookingCancel.reason = bookingCancelDto.reason;
    bookingCancel.sharedBooking = booking;

    await this.sharedBookingCancelRepo.save(bookingCancel);

    //Send notification to the customer
    const notification: NotificationReq = new NotificationReq();
    notification.timeStamp = new Date();
    notification.title = "Booking Cancellation!";
    notification.message = "Your booking has been cancelled";
    notification.userId = booking.customer.id;
    await this.notifications.sendCustomerNotification(notification);

    const commonRes: CommonRes = new CommonRes();
    commonRes.id = booking.id;
    return commonRes;
  }

  //Get all the shared bookings by the customer 
  async getSharedBookingsByCustomer(id: string): Promise<SharedBooking[]> {
    return await this.sharedBookingRepo
      .createQueryBuilder('sharedBooking')
      .leftJoinAndSelect('sharedBooking.booking', 'booking')
      .leftJoinAndSelect('booking.vehicle', 'vehicle')
      .where('sharedBooking.customerId = :customerId', { customerId: id })
      .getMany();
  }

  //Get coordinates of the bookings
  async getBookingsCoordinates(bookingId: string, bookingType: string): Promise<CoordinatesRes> {
    const resp: CoordinatesRes = new CoordinatesRes();
    if (bookingType === "original") {
      const booking = await this.repo.findOne({
        where: {
          id: bookingId
        }
      })

      //Check shared booking is available or not
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
      } else {
        resp.firstLong = booking.startLong;
        resp.firstLat = booking.startLat;
        resp.secondLong = booking.destLong;
        resp.secondLat = booking.destLat;
      }
    } else {
      //If booking type is shared
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
      } else {
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

  //Update booking loading time
  async updateBookingLoadingTime(id: string, time: number): Promise<Booking> {
    const booking = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    booking.loadingTime = time;
    return await this.repo.save(booking);
  }

  //Update booking unloading time and calculate all the charges
  async updateBookingUnloadingTime(bookingId: string, time: number): Promise<BookingCompleteRes> {
    const booking = await this.repo.findOne({
      where: {
        id: bookingId,
      },
      relations: ['advancePayment']
    });

    //Check is shared booking available or not
    const sharedBooking = await this.sharedBookingRepo
      .createQueryBuilder('sharedBooking')
      .leftJoinAndSelect('sharedBooking.advancePayment', 'advancePayment')
      .where('sharedBooking.bookingId = :bookingId', { bookingId: booking.id })
      .andWhere('sharedBooking.isCancelled = :isCancelled', { isCancelled: false })
      .andWhere('sharedBooking.advancePaymentId IS NOT NULL')
      .getOne();

    const resp: BookingCompleteRes = new BookingCompleteRes();
    resp.vehicleCharge = parseFloat(booking.vehicleCharge.toFixed(2));
    resp.serviceCharge = parseFloat(booking.serviceCharge.toFixed(2));
    resp.handlingCharge = parseFloat(((booking.loadingTime / 60 + time / 60) * 3).toFixed(2)); //Handling fee is Rs.3 per min
    resp.total = parseFloat((booking.vehicleCharge + booking.serviceCharge + resp.handlingCharge).toFixed(2));
    resp.advancePayment = parseFloat(booking.advancePayment.amount.toFixed(2));

    if (sharedBooking) {
      resp.balPayment = parseFloat((booking.vehicleCharge * booking.loadingCapacity + booking.serviceCharge + resp.handlingCharge - booking.advancePayment.amount).toFixed(2));
      resp.sharedDiscount = ((1 - booking.loadingCapacity) * 100).toFixed(2) + '%';
    } else {
      resp.balPayment = parseFloat((booking.vehicleCharge + booking.serviceCharge + resp.handlingCharge - booking.advancePayment.amount).toFixed(2));
      resp.sharedDiscount = '0%';
    }

    //Update unloadig time of the booking
    booking.unloadingTime = time;
    await this.repo.save(booking);

    return resp;
  }

  //Update shared booking loading time
  async updateSharedBookingLoadingTime(id: string, time: number): Promise<SharedBooking> {
    const booking = await this.sharedBookingRepo.findOne({
      where: {
        id: id,
      },
    });
    booking.loadingTime = time;
    return await this.sharedBookingRepo.save(booking);
  }

  //Update shared boooking unlaoding time and calculate all the charges
  async updateSharedBookingUnloadingTime(id: string, time: number): Promise<BookingCompleteRes> {
    const sharedBooking = await this.sharedBookingRepo.findOne({
      where: {
        id: id,
      },
      relations: ['booking', 'advancePayment']
    });

    const resp: BookingCompleteRes = new BookingCompleteRes();
    resp.vehicleCharge = parseFloat(sharedBooking.vehicleCharge.toFixed(2));
    resp.serviceCharge = parseFloat(sharedBooking.serviceCharge.toFixed(2));
    resp.handlingCharge = parseFloat(((sharedBooking.loadingTime / 60 + time / 60) * 3).toFixed(2)); //Handling fee is Rs.3 per min
    resp.total = parseFloat((sharedBooking.vehicleCharge + sharedBooking.serviceCharge + resp.handlingCharge).toFixed(2));
    resp.advancePayment = parseFloat((sharedBooking.advancePayment.amount).toFixed(2));

    //Check orgignal booking is cancel or not
    if (sharedBooking.booking.isCancelled) {
      resp.total = parseFloat(
        (sharedBooking.vehicleCharge + sharedBooking.serviceCharge + resp.handlingCharge - sharedBooking.advancePayment.amount)
          .toFixed(2)
      );
      resp.sharedDiscount = '0%';
    } else {
      resp.balPayment = parseFloat(
        (sharedBooking.vehicleCharge * (1 - sharedBooking.booking.loadingCapacity) +
          sharedBooking.serviceCharge + resp.handlingCharge - sharedBooking.advancePayment.amount)
          .toFixed(2)
      );
      resp.sharedDiscount = (sharedBooking.booking.loadingCapacity * 100).toFixed(2) + '%';
    }

    //Update unloading time of the shared booking
    sharedBooking.unloadingTime = time;
    await this.sharedBookingRepo.save(sharedBooking);

    return resp;
  }

  //Get shared bookings that original bookings cancelled
  async getOriginalCancelledShared(customerId: string): Promise<any[]> {
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

    const sharedBookings: any[] = [];
    if (bookings.length !== 0) {
      for (const booking of bookings) {
        for (const sBooking of booking.sharedBooking) {
          if (sBooking.customer.id === customerId) {
            const res: any = {};
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
            } else {
              res.isPaid = false;
            }
            const vehicleObj: any = {};
            vehicleObj.id = booking.vehicle.id;
            vehicleObj.type = booking.vehicle.type;
            vehicleObj.preferredArea = booking.vehicle.preferredArea;
            vehicleObj.capacity = booking.vehicle.capacity;
            vehicleObj.capacityUnit = booking.vehicle.capacityUnit;
            vehicleObj.photoUrl = booking.vehicle.photoUrl;
            vehicleObj.chargePerKm = booking.vehicle.chargePerKm;
            res.vehicle = vehicleObj;

            if (sBooking.status === 'complete') {
              const driverObj: any = {};
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

  //Record balance payment data
  async recordBalPayment(paymentReq: BalPaymentReq, bookingId: string) {
    let booking: Booking | SharedBooking;

    if (paymentReq.bookingType === 'original') {
      booking = await this.repo.findOne({
        where: {
          id: bookingId
        },
        relations: ["vehicle.owner", "vehicle.driverVehicle", "customer"]
      });
    } else {
      booking = await this.sharedBookingRepo.findOne({
        where: {
          id: bookingId
        },
        relations: ["booking.vehicle.owner", "booking.vehicle.driverVehicle", "customer"]
      });
    }

    //Get driver's data
    const assignDriver = await this.driverVehiRepo.createQueryBuilder('driverVehi')
      .leftJoinAndSelect('driverVehi.driver', 'driver')
      .leftJoinAndSelect('driver.owner', 'owner')
      .where('driverVehi.vehicleId = :vehicleId', {
        vehicleId: booking instanceof Booking ?
          booking.vehicle.id
          :
          booking.booking.vehicle.id
      })
      .andWhere('driverVehi.removedDate IS NULL')
      .getOne();

    const payment: BalPayment = new BalPayment();
    payment.date = new Date();
    payment.stripeId = paymentReq.stripeId;
    payment.amount = paymentReq.balPayment;
    payment.driver = assignDriver.driver;
    const balPayment = await this.balPaymentRepo.save(payment);

    booking.balPayment = balPayment;
    booking.status = 'complete';
    if (booking instanceof Booking) {
      await this.repo.save(booking);
    } else {
      await this.sharedBookingRepo.save(booking);
    }

    //Update owner wallet
    const updatedWallet = await this.updateWallet(booking instanceof Booking ?
      booking.vehicle.owner
      :
      booking.booking.vehicle.owner, paymentReq.balPayment);

    //Record transaction
    await this.recordOwnerTransaction(paymentReq.serviceCharge, booking, updatedWallet);

    //Record service charge
    await this.recordServiceCharge(paymentReq.serviceCharge, booking);

    //If reward selected handle reward process
    let reward: CustomerRewards = new CustomerRewards();
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

    //Calculate rewards of customer for current booking
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
      //Check rewards offers for, this time period
      const rewards = await this.customerRewardsRepo.createQueryBuilder("cusRewards")
        .where("cusRewards.customerId = :customerId", { customerId: booking.customer.id })
        .andWhere("cusRewards.date BETWEEN :startDate AND :endDate", { startDate: threeMonthsBack, endDate: today })
        .getMany();

      if (rewards.length === 0) {
        const newReward: CustomerRewards = new CustomerRewards();
        newReward.date = new Date();
        newReward.reward = 0.05; //5%
        newReward.customer = booking.customer;
        newReward.balPayment = balPayment;
        await this.customerRewardsRepo.save(newReward);
      }
    }
    const oneMonthBack = new Date();
    oneMonthBack.setMonth(today.getMonth() - 1);

    //Calculate owner rewards
    //Calculate bookings count
    const ownerBookingCount = await this.repo.createQueryBuilder("booking")
      .leftJoinAndSelect("booking.vehicle", "vehicle")
      .leftJoinAndSelect("vehicle.owner", "owner")
      .leftJoinAndSelect("booking.balPayment", "balPayment")
      .where("booking.bookingDate BETWEEN :startDate AND :endDate", { startDate: oneMonthBack, endDate: today })
      .andWhere("booking.status = :status", { status: "complete" })
      .andWhere("owner.id = :ownerId", {
        ownerId:
          booking instanceof Booking ?
            booking.vehicle.owner.id
            :
            booking.booking.vehicle.owner.id
      })
      .getMany();

    //Calculate shared booking count
    const ownerSharedBookingCount = await this.sharedBookingRepo.createQueryBuilder("sharedBooking")
      .leftJoinAndSelect("sharedBooking.booking", "booking")
      .leftJoinAndSelect("booking.vehicle", "vehicle")
      .leftJoinAndSelect("vehicle.owner", "owner")
      .leftJoinAndSelect("sharedBooking.balPayment", "balPayment")
      .where("booking.bookingDate BETWEEN :startDate AND :endDate", { startDate: oneMonthBack, endDate: today })
      .andWhere("sharedBooking.status = :status", { status: "complete" })
      .andWhere("owner.id = :ownerId", {
        ownerId:
          booking instanceof Booking ?
            booking.vehicle.owner.id
            :
            booking.booking.vehicle.owner.id
      })
      .getMany();

    const totalCount = ownerBookingCount.length + ownerSharedBookingCount.length;

    if (totalCount >= 20) {
      //Check rewards offers for, this time period
      const rewards = await this.ownerRewardsRepo.createQueryBuilder("ownerRewards")
        .where("ownerRewards.ownerId = :ownerId", {
          ownerId:
            booking instanceof Booking ?
              booking.vehicle.owner.id
              :
              booking.booking.vehicle.owner.id
        })
        .andWhere("ownerRewards.date BETWEEN :startDate AND :endDate", { startDate: oneMonthBack, endDate: today })
        .getMany();

      if (rewards.length === 0) {
        let totalEarned: number = 0;
        //Calculate earned amount from original bookings
        if (ownerBookingCount.length !== 0) {
          for (const b of ownerBookingCount) {
            totalEarned += b.balPayment.amount;
          }
        }

        //Calculate earned amount from shared bookings
        if (ownerSharedBookingCount.length !== 0) {
          for (const s of ownerSharedBookingCount) {
            totalEarned += s.balPayment.amount;
          }
        }

        const newReward: OwnerRewards = new OwnerRewards();
        newReward.date = new Date();
        newReward.rewardAmount = totalEarned * 0.05; //5%
        newReward.owner = booking instanceof Booking ? booking.vehicle.owner : booking.booking.vehicle.owner;
        await this.ownerRewardsRepo.save(newReward);

      }
    }

    //Send notification to the owner
    const notification: NotificationReq = new NotificationReq();
    notification.timeStamp = new Date();
    notification.title = "Booking Completed!";
    notification.message = `Customer made the balance payment for booking id ${booking instanceof Booking ? booking.id : booking.booking.id}`;
    notification.userId = booking instanceof Booking ? booking.vehicle.owner.id : booking.booking.vehicle.owner.id;
    await this.notifications.sendOwnerNotification(notification);

    //Send notification to the driver
    notification.message = `Customer made the balance payment for booking id ${booking instanceof Booking ? booking.id : booking.booking.id}`;
    notification.userId = assignDriver.id;
    await this.notifications.sendDriverNotification(notification);

    //Send notification to the customer
    notification.message = "Your booking has been completed!";
    notification.userId = booking.customer.id;
    await this.notifications.sendCustomerNotification(notification);

    return { bookingId: balPayment.id, booking: booking };
  }

  //Make a rate and review
  async makeRateReview(rateReviewReq: RateReviewReq, customerId: string): Promise<RateReview> {
    const customer = await this.customerRepo.findOne({
      where: {
        id: customerId
      }
    });

    let booking: Booking | SharedBooking;
    if (rateReviewReq.bookingType === "original") {
      booking = await this.repo.findOne({
        where: {
          id: rateReviewReq.bookingId
        },
      });
    } else {
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
    })

    const rateReview: RateReview = new RateReview();
    rateReview.date = new Date();
    rateReview.rate = rateReviewReq.rate;
    rateReview.review = rateReviewReq.review;
    if (booking instanceof Booking) {
      rateReview.booking = booking;
    } else {
      rateReview.sharedBooking = booking;
    }
    rateReview.driver = driver;
    rateReview.customer = customer;

    return await this.rateReviewRepo.save(rateReview);
  }

  //Get owner data by booking id
  async getOwner(bookingId: string, type: string): Promise<Owner> {
    if (type === 'original') {
      const booking = await this.repo.findOne({
        where: {
          id: bookingId
        },
        relations: ["vehicle.owner"]
      })
      return booking.vehicle.owner;
    }

    const sharedBooking = await this.sharedBookingRepo.findOne({
      where: {
        id: bookingId
      },
      relations: ["booking.vehicle.owner"]
    })
    return sharedBooking.booking.vehicle.owner;
  }

  //Get driver data by upcoming booking id
  async getUpcomingDriver(bookingId: string, type: string): Promise<Driver> {
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

    //Get shared booking driver
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

  //Get driver by completed booking id
  async getCompletedDriver(bookingId: string, type: string): Promise<Driver> {
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
    })
    return sBooking.balPayment.driver;
  }

  //Get customer by booking id
  async getCustomer(bookingId: string, type: string): Promise<Customer> {
    if (type === 'original') {
      const booking = await this.repo.findOne({
        where: {
          id: bookingId
        },
        relations: ['customer']
      })
      return booking.customer;
    }

    const sBooking = await this.sharedBookingRepo.findOne({
      where: {
        id: bookingId
      },
      relations: ['customer']
    })
    return sBooking.customer;
  }

  //Get rates and review by boooking id
  async getRateReview(bookingId: string, type: string): Promise<RateReview> {
    if (type === 'original') {
      return await this.rateReviewRepo.createQueryBuilder("rate")
        .where("rate.bookingId = :bookingId", { bookingId: bookingId })
        .getOne();
    }

    return await this.rateReviewRepo.createQueryBuilder("rate")
      .where("rate.sharedBookingId = :bookingId", { bookingId: bookingId })
      .getOne();
  }

  //Get vehicle by booking id
  async getVehicle(bookingId: string, type: string): Promise<Vehicle> {
    if (type === 'original') {
      const booking = await this.repo.findOne({
        where: {
          id: bookingId
        },
        relations: ["vehicle"]
      })
      return booking.vehicle;
    }

    const sharedBooking = await this.sharedBookingRepo.findOne({
      where: {
        id: bookingId
      },
      relations: ["booking.vehicle"]
    })
    return sharedBooking.booking.vehicle;
  }

  //Get all bookings count
  async getBookingsCount(): Promise<BookingCountRes> {
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

    const countRes: BookingCountRes = new BookingCountRes();
    countRes.originalUpcoming = originalUpcoming;
    countRes.originalCompleted = originalCompleted
    countRes.originalCancelled = originalCancelled;
    countRes.totalOriginal = originalUpcoming + originalCompleted + originalCancelled;
    countRes.sharedUpcoming = sharedUpcoming;
    countRes.sharedCompleted = sharedCompleted;
    countRes.sharedCancelled = sharedCancelled;
    countRes.totalShared = sharedUpcoming + sharedCompleted + sharedCancelled;
    countRes.total = countRes.totalOriginal + countRes.totalShared;

    return countRes;
  }

  //Get cancelle reason by booking Id
  async getCancelledReason(bookingId: string, type: string): Promise<CancelledReasonRes> {
    const cancelledReason: CancelledReasonRes = new CancelledReasonRes();
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

  //Get service charges
  async getServiceCharges(): Promise<any[]> {
    const serviceCharges = await this.serviceChargeRepo.find({
      relations: ["booking", "sharedBooking"]
    });

    const response: any[] = [];

    if (serviceCharges.length !== 0) {
      for (const s of serviceCharges) {
        const respObj: any = {};
        respObj.id = s.id;
        respObj.date = s.date;
        respObj.amount = s.amount;
        respObj.type = s.type;
        if (s.booking) {
          respObj.bookingType = 'original';
        } else {
          respObj.bookingType = 'shared';
        }
        response.push(respObj);
      }
    }
    return response;
  }

  //Get rewards
  async getRewards(): Promise<any> {
    const response = {
      ownerRewards: [],
      CustomerRewards: []
    }
    //Get rewards given to the owner
    const ownerRewards = await this.ownerRewardsRepo.find({
      relations: ["owner"]
    });
    if (ownerRewards.length !== 0) {
      for (const r of ownerRewards) {
        const rewardObj: any = {};
        rewardObj.id = r.id;
        rewardObj.data = r.date;
        rewardObj.isClaimed = r.isClaimed;
        rewardObj.amount = parseFloat(r.rewardAmount.toFixed(2));
        rewardObj.ownerId = r.owner.id;
        response.ownerRewards.push(rewardObj);
      }
    }

    //Get rewards given to the customer
    const cusRewards = await this.customerRewardsRepo.find({
      relations: ["balPayment", "customer"]
    });

    if (cusRewards.length !== 0) {
      for (const r of cusRewards) {
        const rewardObj: any = {};
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

  //Get booking data by id
  async getBookingData(bookingId: string, type: string): Promise<BookingRes | SharedBookingRes> {
    if (type === 'original') {
      const booking = await this.repo.findOne({
        where: {
          id: bookingId
        },
        relations: ["sharedBooking"]
      });

      const bookingRes: BookingRes = new BookingRes();
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
            bookingRes.sharedBookingId = sBooking.id
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
    const bookingRes: SharedBookingRes = new SharedBookingRes();
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

  //Get payment history by customer id
  async getPaymentHistory(customerId: string): Promise<PaymentHistoryRes[]> {
    const bookings = await this.repo.createQueryBuilder("booking")
      .leftJoinAndSelect("booking.balPayment", "balPayment")
      .leftJoinAndSelect("booking.advancePayment", "advancePayment")
      .where("booking.customerId = :customerId", { customerId: customerId })
      .getMany();

    const response: PaymentHistoryRes[] = [];

    if (bookings.length !== 0) {
      for (const b of bookings) {
        const paymentObj: PaymentHistoryRes = new PaymentHistoryRes();
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

  //Get drivers and their bookings count
  async getDriversBookingCount(ownerId: string): Promise<DriversBookingCountRes[]> {
    const drivers = await this.driverRepo.createQueryBuilder("driver")
      .where("driver.ownerId = :ownerId", { ownerId: ownerId })
      .getMany();

    const balPayments = await this.balPaymentRepo.find({
      relations: ["driver"]
    });

    const response: DriversBookingCountRes[] = [];
    if (drivers.length !== 0) {
      for (const d of drivers) {
        const driverCount: DriversBookingCountRes = new DriversBookingCountRes();
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

  //Get available return trips
  async getReturnTrips(): Promise<Booking[]> {
    const response: Booking[] = [];
    return await this.repo.find({
      where: {
        isReturnTrip: false,
        status: 'upcoming'
      },
      relations: ["vehicle", "sharedBooking"]
    })
  }

  //Get owner rates
  async getOwnerRates(ownerId: string): Promise<number> {
    const drivers = await this.driverRepo.createQueryBuilder("driver")
      .where("driver.ownerId = :ownerId", { ownerId: ownerId })
      .getMany();

    const rates = await this.rateReviewRepo.find({
      relations: ["driver"]
    });

    let count: number = 0;
    let totalRates: number = 0;

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

  //Get balance payment pending boookings by the customer
  async getBalancePaymentPendings(customerId: string): Promise<AllBookingsRes> {
    const response: AllBookingsRes = new AllBookingsRes();
    //Get original bookings
    const originals = await this.repo.createQueryBuilder("booking")
      .where("booking.customerId = :customerId", { customerId: customerId })
      .andWhere("booking.unloadingTime != 0")
      .andWhere("booking.balPayment IS NULL")
      .getMany();

    if (originals.length !== 0) {
      const orgBookings: OrgBookingRes[] = [];
      for (const b of originals) {
        const obj: OrgBookingRes = new OrgBookingRes();
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

    //Get shared bookings
    const shared = await this.sharedBookingRepo.createQueryBuilder("sBooking")
      .leftJoinAndSelect("sBooking.booking", "booking")
      .where("sBooking.customerId = :customerId", { customerId: customerId })
      .andWhere("sBooking.unloadingTime != 0")
      .andWhere("sBooking.balPayment IS NULL")
      .getMany();

    if (shared.length !== 0) {
      const sharedBookings: CusSharedBookingRes[] = []
      for (const b of shared) {
        const obj: CusSharedBookingRes = new CusSharedBookingRes();
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

  //-----------------------------private methods-----------------------------
  private async recordServiceCharge(amount: number, booking: Booking | SharedBooking, type?: string): Promise<null> {
    const serviceCharge: ServiceCharge = new ServiceCharge;
    serviceCharge.date = new Date();
    serviceCharge.amount = amount;
    if (booking instanceof Booking) {
      serviceCharge.booking = booking;
    } else {
      serviceCharge.sharedBooking = booking;
    }
    serviceCharge.type = type;
    await this.serviceChargeRepo.save(serviceCharge);
    return;
  }

  private async recordOwnerTransaction(amount: number, booking: Booking | SharedBooking, wallet: OwnerWallet): Promise<null> {
    const ownerCredit: OwnerCredit = new OwnerCredit;
    ownerCredit.date = new Date();
    ownerCredit.amount = amount;
    if (booking instanceof Booking) {
      ownerCredit.booking = booking;
    } else {
      ownerCredit.sharedBooking = booking;
    }
    ownerCredit.wallet = wallet;
    await this.ownerCreditRepo.save(ownerCredit);
    return;
  }

  private async updateWallet(owner: Owner, amount: number): Promise<OwnerWallet> {
    //Record payment amount of the owner
    const wallet = await this.ownerWalletRepo.createQueryBuilder('wallet')
      .where('wallet.ownerId = :ownerId', { ownerId: owner.id })
      .getOne();

    let updatedWallet: OwnerWallet = new OwnerWallet();

    //Check wallet available or not
    if (wallet) {
      wallet.earnings = wallet.earnings + amount;
      updatedWallet = await this.ownerWalletRepo.save(wallet);
    } else {
      updatedWallet.earnings = amount;
      updatedWallet.owner = owner;
      updatedWallet = await this.ownerWalletRepo.save(updatedWallet);
    }

    return updatedWallet;
  }

  private async getNearbyCities(
    startLat: number,
    startLong: number,
    endLat: number,
    endLong: number,
  ): Promise<String[]> {
    const resp = await client.directions({
      params: {
        origin: `${startLat}, ${startLong}`,
        destination: `${endLat}, ${endLong}`,
        mode: TravelMode.driving,
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

  private async getCitiesFromCoord(lat: number, long: number): Promise<String> {
    const client = new Client();
    const resp = await client.reverseGeocode({
      params: {
        latlng: `${lat}, ${long}`,
        key: process.env.MAP_API,
      },
    });

    if (resp.data.results.length !== 0) {
      for (const result of resp.data.results) {
        for (const component of result.address_components) {
          if (component.types.includes(AddressType.locality)) {
            return component.long_name;
          }
        }
      }
    }
  }
}