import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { BookingCompleteRes } from "src/driver/responses/bookingComplete.res";
import { CommonService } from "./common.service";
import { BookingService } from "src/booking/booking.service";
import { OwnerRes } from "./responses/owner.res";
import { DriverRes } from "./responses/driver.res";
import { CustomerRes } from "./responses/customer.res";
import { RateReviewRes } from "./responses/rateReview.res";
import { VehicleRes } from "./responses/vehicle.res";
import { CancelledReasonRes } from "./responses/cancelledReason.res";
import { CommonRes } from "./responses/common.res";
import { BookingRes } from "./responses/booking.res";
import { SharedBookingRes } from "./responses/sharedBooking.res";
import { HTML } from "src/templates/html";
import { OtpReq } from "./requests/otp.req";
import { Password } from "./requests/password.req";
import { FeedbackRes } from "src/customer/responses/feedback.res";

@ApiTags('common')
@Controller('common')
export class CommonController {
    constructor(
        private readonly commonService: CommonService,
        private readonly bookingService: BookingService
    ) { }

    @UseGuards(AuthGuard)
    @Get('paymentSummery/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Payment summery", type: BookingCompleteRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get payment summery of the unloaded bookings" })
    async getPaymentSummery(@Param('id') id: string, @Query('type') bookingType: string, @Res() res: Response) {
        try {
            if (bookingType === 'original' || bookingType === 'shared') {
                const resp = await this.commonService.calPaymentSummery(id, bookingType);
                return res.status(HttpStatus.OK).json(resp);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get owner data by bookingId
    @UseGuards(AuthGuard)
    @Get('owner/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Owner data", type: OwnerRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get owner's data by booking id" })
    async getOwnersData(@Param('id') bookingId: string, @Query('type') type: string, @Res() res: Response) {
        try {
            if (type === 'original' || type === 'shared') {
                const owner = await this.bookingService.getOwner(bookingId, type);
                const ownerRes: OwnerRes = new OwnerRes();
                ownerRes.id = owner.id;
                ownerRes.firstName = owner.firstName;
                ownerRes.lastName = owner.lastName;
                ownerRes.address = owner.address;
                ownerRes.email = owner.email;
                owner.mobNumber = owner.mobNumber;
                return res.status(HttpStatus.OK).json(ownerRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get driver data of upcoming booking
    @UseGuards(AuthGuard)
    @Get('upcomingDriver/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Driver data", type: DriverRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get drivers's data by upcoming booking id" })
    async getUpcomingDriver(@Param('id') bookingId: string, @Query('type') type: string, @Res() res: Response) {
        try {
            if (type === 'original' || type === 'shared') {
                const driver = await this.bookingService.getUpcomingDriver(bookingId, type);
                const driverRes: DriverRes = new DriverRes();
                driverRes.id = driver.id;
                driverRes.firstName = driver.firstName;
                driverRes.lastName = driver.lastName;
                driverRes.email = driver.email;
                driverRes.mobNumber = driver.phoneNumber;
                driverRes.address = driver.address;
                driverRes.heavyVehicle = driver.heavyVehicleLic;
                return res.status(HttpStatus.OK).json(driverRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get driver data of completed bookings
    @UseGuards(AuthGuard)
    @Get('completedDriver/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Driver data", type: DriverRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get drivers's data by completed booking id" })
    async getCompletedDriver(@Param('id') bookingId: string, @Query('type') type: string, @Res() res: Response) {
        try {
            if (type === 'original' || type === 'shared') {
                const driver = await this.bookingService.getCompletedDriver(bookingId, type);
                const driverRes: DriverRes = new DriverRes();
                driverRes.id = driver.id;
                driverRes.firstName = driver.firstName;
                driverRes.lastName = driver.lastName;
                driverRes.email = driver.email;
                driverRes.mobNumber = driver.phoneNumber;
                driverRes.address = driver.address;
                driverRes.heavyVehicle = driver.heavyVehicleLic;
                return res.status(HttpStatus.OK).json(driverRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get driver data of completed bookings
    @UseGuards(AuthGuard)
    @Get('customer/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Customer data", type: CustomerRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get customer's data by booking id" })
    async getCustomer(@Param('id') bookingId: string, @Query('type') type: string, @Res() res: Response) {
        try {
            if (type === 'original' || type === 'shared') {
                const customer = await this.bookingService.getCustomer(bookingId, type);
                const customerRes: CustomerRes = new CustomerRes();
                customerRes.id = customer.id;
                customerRes.firstName = customer.firstName;
                customer.lastName = customer.lastName;
                customerRes.email = customer.email;
                customerRes.address = customer.address;
                customerRes.gender = customer.gender;
                customerRes.mobNumber = customer.mobileNum;
                return res.status(HttpStatus.OK).json(customerRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get ratings and review of the booking
    @UseGuards(AuthGuard)
    @Get('rates/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Rates and review", type: RateReviewRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Rate and review not posted" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get rates and review by booking id" })
    async getRateReview(@Param('id') bookingId: string, @Query('type') type: string, @Res() res: Response) {
        try {
            if (type === 'original' || type === 'shared') {
                const rate = await this.bookingService.getRateReview(bookingId, type);
                if (rate) {
                    const rateReviewRes: RateReviewRes = new RateReviewRes();
                    rateReviewRes.id = rate.id;
                    rateReviewRes.rate = rate.rate;
                    rateReviewRes.review = rate.review;
                    return res.status(HttpStatus.OK).json(rateReviewRes);
                }
                return res.status(HttpStatus.NOT_FOUND).json("Rate and review not posted");
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get ratings and review of the booking
    @UseGuards(AuthGuard)
    @Get('vehicle/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Vehicle date", type: VehicleRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get vehicle by booking id" })
    async getVehicle(@Param('id') bookingId: string, @Query('type') type: string, @Res() res: Response) {
        try {
            if (type === 'original' || type === 'shared') {
                const vehicle = await this.bookingService.getVehicle(bookingId, type);
                const vehicleRes: VehicleRes = new VehicleRes();
                vehicleRes.id = vehicle.id;
                vehicleRes.type = vehicle.type;
                vehicleRes.regNo = vehicle.regNo;
                vehicleRes.preferredArea = vehicle.preferredArea;
                vehicleRes.capacity = vehicle.capacity;
                vehicleRes.capacityUnit = vehicle.capacityUnit;
                vehicleRes.photoUrl = vehicle.photoUrl;
                vehicleRes.chargePerKm = vehicle.chargePerKm;
                vehicleRes.heavyVehicle = vehicle.heavyVehicle;
                return res.status(HttpStatus.OK).json(vehicleRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get cancelld resaon by booking id
    @UseGuards(AuthGuard)
    @Get('cancelledReason/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Cancelled reason", type: CancelledReasonRes })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get cancelled reason by booking id" })
    async getCancelledReasin(@Param('id') bookingId: string, @Query('type') type: string, @Res() res: Response) {
        try {
            if (type === 'original' || type === 'shared') {
                const resp = await this.bookingService.getCancelledReason(bookingId, type);
                return res.status(HttpStatus.OK).json(resp);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get booking data by booking id
    @UseGuards(AuthGuard)
    @Get('booking/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking id'
    })
    @ApiQuery({
        name: 'type',
        required: true,
        type: String,
        description: 'booking type',
        enum: ['original', 'shared']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Booking data" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get booking data by booking id" })
    async getBookingData(@Param('id') bookingId: string, @Query('type') type: string, @Res() res: Response) {
        try {
            if (type === 'original' || type === 'shared') {
                const resp = await this.bookingService.getBookingData(bookingId, type)
                return res.status(HttpStatus.OK).json(resp);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Send email otp for forgot password
    @Post('otp/:email')
    @ApiParam({
        name: 'email',
        required: true,
        type: String,
        description: 'user email'
    })
    @ApiQuery({
        name: 'userType',
        required: true,
        type: String,
        description: 'user type',
        enum: ['customer', 'driver', 'owner']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "User ID", type: CommonRes })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "send email otp for forgot password" })
    async sendEmailOtp(@Param('email') userEmail: string, @Query('userType') userType: string, @Res() res: Response) {
        try {
            if (userType === 'customer' || userType === 'driver' || userType === 'owner') {
                const resp = await this.commonService.genarateOtp(userEmail, userType);
                const html: HTML = new HTML(resp.firstName, resp.lastName);
                const message = html.sendOtp(resp.otp);
                await this.commonService.sendNotifications(resp.email, 'Your Gulf Transportation Solution OTP Code!', message);
                const commonRes: CommonRes = new CommonRes()
                commonRes.id = resp.id;
                return res.status(HttpStatus.OK).json(commonRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid user type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Verify otp
    @Post('verifyOtp/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'user Id'
    })
    @ApiQuery({
        name: 'userType',
        required: true,
        type: String,
        description: 'user type',
        enum: ['customer', 'driver', 'owner']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "OTP verified" })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Invalid OTP" })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "OTP expired" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "verify otp" })
    async verifyOtp(@Body() otp: OtpReq, @Param('id') userId: string, @Query('userType') userType: string, @Res() res: Response) {
        try {
            if (userType === 'customer' || userType === 'driver' || userType === 'owner') {
                await this.commonService.verifyOtp(userType, userId, otp, res);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid user type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //change password
    @Put('changePassword/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'user Id'
    })
    @ApiQuery({
        name: 'userType',
        required: true,
        type: String,
        description: 'user type',
        enum: ['customer', 'driver', 'owner']
    })
    @ApiResponse({ status: HttpStatus.OK, description: "ID of updated user", type: CommonRes })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "change forgot password" })
    async changePassword(@Param('id') userId: string, @Query('userType') userType: string, @Body() password: Password, @Res() res: Response) {
        try {
            if (userType === 'customer' || userType === 'driver' || userType === 'owner') {
                const resp = await this.commonService.changePassword(userId, userType, password);
                const commonRes: CommonRes = new CommonRes();
                commonRes.id = resp.id;
                return res.status(HttpStatus.OK).json(commonRes);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid user type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }

    //Get all the approved feedbacks provided by customer
    @Get('feedbacks')
    @ApiResponse({ status: HttpStatus.OK, description: "List of approved feedbacks", type: [FeedbackRes] })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get all the approved feedbacks" })
    async getFeedbacks(@Res() res: Response) {
        try {
            const response: FeedbackRes[] = [];
            const resp = await this.commonService.getFeedbacks();
            if (resp.length !== 0) {
                for (const f of resp) {
                    const obj: FeedbackRes = new FeedbackRes();
                    obj.id = f.id;
                    obj.createdAt = f.createdAt;
                    obj.customerName = f.customer.firstName + ' ' + f.customer.lastName;
                    obj.photoUrl = f.customer.profilePic;
                    obj.feedback = f.feedback;
                    response.push(obj);
                }
            }
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
    }
}