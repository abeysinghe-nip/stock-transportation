import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { Response } from 'express';
import { CustomerDto } from './dtos/cutomer.dto';
import { SignInDto } from 'src/common/requests/signIn.dto';
import { CommonService } from 'src/common/common.service';
import { HTML } from 'src/templates/html';
import { SignInResponse } from 'src/common/responses/signin.res';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { BookingService } from 'src/booking/booking.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookingDto } from 'src/booking/dtos/booking.dto';
import { ChargesRes } from './responses/charges.res';
import { IntentRes } from './responses/intent.res';
import { IntentReq } from './requests/intent.req';
import { BookingCancelDto } from 'src/booking/dtos/bookingCancel.dto';
import { CommonRes } from 'src/common/responses/common.res';
import { PaymentDto } from 'src/booking/dtos/payment.dto';
import { CalChargeReq } from './requests/calCharge.req';
import { SharedBookingReq } from './requests/sharedBooking.req';
import * as moment from 'moment';
import { BalPaymentReq } from './requests/balPayment.req';
import { RateReviewReq } from './requests/rateReview.req';
import { ChangePasswordReq } from 'src/common/requests/changePassword.req';
import { CustomerRewardsReq } from './requests/customerRewards.req';
import { ProfileRes } from './responses/profile.res';
import { UpdateProfileReq } from 'src/common/requests/updateProfile.req';
import { AuthService } from 'src/auth/auth.service';
import { PaymentHistoryRes } from './responses/paymentHistory.res';
import { CustomerNotification } from './entities/customerNotification.entity';
import { NotificationRes } from 'src/common/responses/notification.res';
import { FeedbackReq } from './requests/feedback.req';
import { AllBookingsRes } from './responses/allBookings.res';

@ApiTags("customer")
@Controller('customer')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
        private readonly commonService: CommonService,
        private readonly vehicleService: VehicleService,
        private readonly bookingService: BookingService,
        private readonly authService: AuthService,
    ) { }

    //create customer
    @Post('createCustomer')
    @ApiBody({ type: CustomerDto })
    @ApiResponse({ status: HttpStatus.OK, description: "Customer succefully created" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "create customer" })
    async createCustomer(@Body() customerDto: CustomerDto, @Res() res: Response) {
        try {
            const customer = await this.customerService.createCustomer(customerDto);

            //send notification via email
            const html: HTML = new HTML(customer.firstName, customer.lastName);
            const message: string = html.createCustomer();
            await this.commonService.sendNotifications(customer.email, 'Your Account is Successfully Created', message);

            return res.status(HttpStatus.OK).json("Owner succefully created");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Check customer email availability
    @Get('emailAvailability/:email')
    @ApiParam({
        name: "email",
        required: true,
        type: String,
        description: "owner entered email address"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Email not found" })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Email exist" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "check availability of the customer email" })
    async emailAvailability(@Param("email") email: string, @Res() res: Response) {
        try {
            const resp: boolean = await this.customerService.emailAvilability(email);
            if (resp) {
                return res.status(HttpStatus.CONFLICT).json("Email exist");
            }
            return res.status(HttpStatus.OK).json("Email not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //customer signin
    @Post('signin')
    @ApiResponse({ status: HttpStatus.OK, description: "Customer ID", type: SignInResponse })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Mismatched" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Customer not found" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "customer signin" })
    async signin(@Body() signinDto: SignInDto, @Res() res: Response) {
        try {
            const customer = await this.customerService.signin(signinDto.userName);
            if (customer) {
                const isMatched = await this.commonService.passwordDecrypt(customer.password, signinDto.password);
                if (isMatched) {
                    const access_token = await this.authService.signin(customer.id, customer.email);
                    return res.status(HttpStatus.OK).json(access_token)
                }
                return res.status(HttpStatus.NOT_ACCEPTABLE).json("Mismatched");
            }
            return res.status(HttpStatus.NOT_FOUND).json("customer not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //get all vehicles
    @Get('vehicles')
    @ApiResponse({ status: HttpStatus.OK, description: "Vehicles List" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all vehicles" })
    async getVehicles(@Res() res: Response) {
        try {
            const response = [];
            const vehicles: Vehicle[] = await this.vehicleService.getAllVehicles();
            if (vehicles.length !== 0) {
                for (const vehicle of vehicles) {
                    const vehicleObj: any = {};
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

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //cal charges for booking
    @UseGuards(AuthGuard)
    @Post('calCharge')
    @ApiResponse({ status: HttpStatus.OK, description: "Calculated charges", type: ChargesRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "calculate charges for booking" })
    async calCharges(@Body() calChargeReq: CalChargeReq, @Res() res: Response) {
        try {
            const resp = await this.bookingService.calCharges(calChargeReq);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //make a booking
    @UseGuards(AuthGuard)
    @Post('booking')
    @ApiResponse({ status: HttpStatus.OK, description: "Booking Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Another booking available" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "make a booking" })
    async booking(@Body() bookingDto: BookingDto, @Res() res: Response) {
        try {
            const booking = await this.bookingService.create(bookingDto);
            if (booking.id) { 
                const commonRes: CommonRes = new CommonRes();
                commonRes.id = booking.id;
                return res.status(HttpStatus.OK).json(commonRes); 
            };
            return res.status(HttpStatus.CONFLICT).json("Another booking available");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //get bookings
    @UseGuards(AuthGuard)
    @Get('myBookings/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "customer Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "list of bookings" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get bookings list by customer" })
    async getBookings(@Param('id') id: string, @Res() res: Response) {
        try {
            const response = [];
            const bookings = await this.bookingService.getBookingsCustomer(id);

            if (bookings.length !== 0) {
                for (const booking of bookings) {
                    const res: any = {};
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
                    res.type = "original"
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

                    if (booking.status === 'complete') {
                        const driverObj: any = {};
                        driverObj.id = booking.balPayment.driver.id;
                        driverObj.firstName = booking.balPayment.driver.firstName;
                        driverObj.lastName = booking.balPayment.driver.lastName;
                        res.driver = driverObj;
                    }



                    response.push(res);
                }
            }

            //Get shared booking as original bookings that original booking cancelled
            const sharedBookings = await this.bookingService.getOriginalCancelledShared(id);
            if (sharedBookings.length !== 0) {
                for (const sBooking of sharedBookings) {
                    response.push(sBooking);
                }
            }
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //make payment intent for booking
    @UseGuards(AuthGuard)
    @Post('paymentIntent')
    @ApiResponse({ status: HttpStatus.OK, description: "Payment intent", type: IntentRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "create payment intent for a booking" })
    async createPaymentIntent(@Body() intentReq: IntentReq, @Res() res: Response) {
        try {
            const resp = await this.bookingService.createPaymentIntent(intentReq);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //record advance payment data
    @UseGuards(AuthGuard)
    @Post('advancePayment/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "booking Id"
    })
    @ApiQuery({
        name: "type",
        required: true,
        type: String,
        enum: ["normal", "return"],
        description: "booking type"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Payment Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "record advance payment data" })
    async recordPayment(@Query('type') type: string, @Body() paymentDto: PaymentDto, @Param('id') id: string, @Res() res: Response) {
        try {
            if (paymentDto.type === "original" || paymentDto.type === "shared") {
                const resp = await this.bookingService.recordPayment(id, type, paymentDto);
                return res.status(HttpStatus.OK).json(resp);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //cancel bookings
    @UseGuards(AuthGuard)
    @Put('cancelBooking/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "booking Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Cancelled booking Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "cancel booking" })
    async cancelBooking(@Body() bookingCancelDto: BookingCancelDto, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.bookingService.cancelBooking(bookingCancelDto, id);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get shared bookings
    @UseGuards(AuthGuard)
    @Get('sharedBookings')
    @ApiResponse({ status: HttpStatus.OK, description: "List of shared bookings" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get shared bookings" })
    async getSharedBookings(@Res() res: Response) {
        try {
            const bookings = await this.bookingService.getSharedBoookings();
            return res.status(HttpStatus.OK).json(bookings);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Make shared booking
    @UseGuards(AuthGuard)
    @Post('sharedBooking')
    @ApiResponse({ status: HttpStatus.OK, description: "Booking Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Another booking available" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "make a shared booking" })
    async makeSharedBooking(@Body() booking: SharedBookingReq, @Res() res: Response) {
        try {
            const resp = await this.bookingService.makeSharedBooking(booking);
            if (resp.id) return res.status(HttpStatus.OK).json({ bokingId: resp.id });
            return res.status(HttpStatus.CONFLICT).json("Another booking available");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Cancel shared booking
    @UseGuards(AuthGuard)
    @Put('cancelSharedBooking/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "shared booking id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Cancelled booking Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "cancel shared booking" })
    async cancelSharedBooking(@Body() bookingCancelDto: BookingCancelDto, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.bookingService.cancelSharedBooking(bookingCancelDto, id);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get shared booking by the customer
    @UseGuards(AuthGuard)
    @Get('customerSharedBooking/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: "customer Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of customer's shared booking" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get shared booking by customer id" })
    async getSharedBookingByCustomer(@Param('id') id: string, @Res() res: Response) {
        try {
            const bookings = await this.bookingService.getSharedBookingsByCustomer(id);
            const resp: any[] = [];
            if (bookings.length !== 0) {
                for (const booking of bookings) {
                    const r: any = {};
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

                    const b: any = {};
                    b.id = booking.booking.id;
                    b.pickupTime = moment(booking.booking.pickupTime, "H:mm").format("LT");
                    b.endTime = moment(booking.booking.pickupTime, "H:mm").add((booking.booking.travellingTime + booking.booking.avgHandlingTime), 'minutes').format("LT");
                    b.loadingCapacity = booking.booking.loadingCapacity;
                    b.freeCapacity = 1 - booking.booking.loadingCapacity;
                    r.booking = b;

                    const v: any = {};
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
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //record balance payment data
    @UseGuards(AuthGuard)
    @Post('balPaymant/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Payment Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "record balance payment data" })
    async recordBalPayment(@Body() paymentReq: BalPaymentReq, @Param('id') bookingId: string, @Res() res: Response) {
        try {
            if (paymentReq.bookingType === 'original' || paymentReq.bookingType === 'shared') {
                const resp = await this.bookingService.recordBalPayment(paymentReq, bookingId);

                //Send email to the customer
                const html: HTML = new HTML(resp.booking.customer.firstName, resp.booking.customer.lastName);
                const message = html.boookingComplete(resp.booking.id, moment().format('YYYY-MM-DD'));
                await this.commonService.sendNotifications(resp.booking.customer.email, 'Your Ride is Completed!', message);

                const commonRes: CommonRes = new CommonRes();
                commonRes.id = resp.bookingId;
                return res.status(HttpStatus.OK).json(commonRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Make rate and review for booking
    @UseGuards(AuthGuard)
    @Post('rate/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Rate Id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "record customer rate and review for a booking" })
    async makeRateReview(@Body() rateReviewReq: RateReviewReq, @Param('id') id: string, @Res() res: Response) {
        try {
            if (rateReviewReq.bookingType === 'original' || rateReviewReq.bookingType === 'shared') {
                const resp = await this.bookingService.makeRateReview(rateReviewReq, id);
                const commonRes: CommonRes = new CommonRes();
                commonRes.id = resp.id;
                return res.status(HttpStatus.OK).json(commonRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Change password
    @UseGuards(AuthGuard)
    @Put('password/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Password changed successfully" })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Old password mismatched" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "change customer password" })
    async changeDriverPassword(@Body() passwordReq: ChangePasswordReq, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.customerService.changePassword(id, passwordReq);
            if (resp) {
                return res.status(HttpStatus.OK).json("Password changed successfully");
            }
            return res.status(HttpStatus.NOT_ACCEPTABLE).json("Old password mismatched");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get owners rewards
    @UseGuards(AuthGuard)
    @Get('rewards/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of rewards", type: [CustomerRewardsReq] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "customer's rewards" })
    async getRewards(@Param('id') id: string, @Res() res: Response) {
        try {
            const customerRewards: CustomerRewardsReq[] = [];
            const resp = await this.customerService.getRewards(id);
            if (resp.length !== 0) {
                for (const r of resp) {
                    const respObj: CustomerRewardsReq = new CustomerRewardsReq();
                    respObj.id = r.id;
                    respObj.date = r.date;
                    respObj.isClaimed = r.isClaimed;
                    respObj.percentage = r.reward;
                    customerRewards.push(respObj);
                }
            }
            return res.status(HttpStatus.OK).json(customerRewards);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get customer profile
    @UseGuards(AuthGuard)
    @Get('profile/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Profile data", type: [ProfileRes] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get customer's profile" })
    async getProfile(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.customerService.getProfile(id);
            const profile: ProfileRes = new ProfileRes();
            profile.firstName = resp.firstName;
            profile.lastName = resp.lastName;
            profile.address = resp.address;
            profile.gender = resp.gender;
            profile.nic = resp.nic;
            profile.phoneNo = resp.mobileNum;
            profile.email = resp.email;
            profile.profilePic = resp.profilePic;
            return res.status(HttpStatus.OK).json(profile);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Update customer profile
    @UseGuards(AuthGuard)
    @Put('profile/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Profile id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "update customer's profile" })
    async updateProfile(@Body() profileUpdate: UpdateProfileReq, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.customerService.updateProfile(id, profileUpdate);
            const commonRes: CommonRes = new CommonRes();
            commonRes.id = resp.id;
            return res.status(HttpStatus.OK).json(commonRes);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get payment history by customer
    @UseGuards(AuthGuard)
    @Get('payment/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Payment summary", type: [PaymentHistoryRes] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get payment history by customer id" })
    async getPaymentHistory(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.bookingService.getPaymentHistory(id);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get notifications of the customer
    @UseGuards(AuthGuard)
    @Get('notification/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of notifications", type: [NotificationRes] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get notifications by customer id" })
    async getNotifications(@Param('id') id: string, @Res() res: Response) {
        try {
            const response: NotificationRes[] = [];
            const resp = await this.customerService.getNotifications(id);
            if (resp.length !== 0) {
                for (const n of resp) {
                    const notifyObj: NotificationRes = new NotificationRes();
                    notifyObj.id = n.id;
                    notifyObj.timeStamp = n.date;
                    notifyObj.title = n.title;
                    notifyObj.message = n.message;
                    response.push(notifyObj);
                }
            }
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get available return trips
    @UseGuards(AuthGuard)
    @Get('returnTrips')
    @ApiResponse({ status: HttpStatus.OK, description: "List of return trips" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get available return trips" })
    async getReturnTrips(@Res() res: Response) {
        try {
            const response = [];
            const bookings = await this.bookingService.getReturnTrips();
            if (bookings.length !== 0) {
                for (const b of bookings) {
                    const obj: any = {};
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
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Make a feedback
    @UseGuards(AuthGuard)
    @Post('feedback/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Feedback id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "make a feedback" })
    async makeFeedback(@Param('id') id: string, @Body() feedback: FeedbackReq, @Res() res: Response) {
        try {
            const resp = await this.customerService.makeFeedback(id, feedback);
            const commonRes: CommonRes = new CommonRes();
            commonRes.id = resp.id;
            return res.status(HttpStatus.OK).json(commonRes);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get balance payment pending bookings
    @UseGuards(AuthGuard)
    @Get('balPaymentsPending/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of balance payment pending bookings", type: AllBookingsRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get balance payment pending bookings" })
    async getBalancePaymentPendings(@Param('id') customerId: string, @Res() res: Response) {
        try {
            const resp = await this.bookingService.getBalancePaymentPendings(customerId);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

}