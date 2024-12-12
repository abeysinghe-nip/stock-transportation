import { Body, Controller, Delete, forwardRef, Get, HttpStatus, Inject, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CommonService } from 'src/common/common.service';
import { SignInDto } from 'src/common/requests/signIn.dto';
import { SignInResponse } from 'src/common/responses/signin.res';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TimerReq } from './requests/timer.req';
import { TimersGateway } from 'src/gateways/timers.gateway';
import { BookingCompleteRes } from './responses/bookingComplete.res';
import { BookingService } from 'src/booking/booking.service';
import { CoordinatesRes } from './responses/coordinates.res';
import { RideStartReq } from './requests/rideStart.req';
import { HTML } from 'src/templates/html';
import { SendCoordReq } from './requests/sendCoord.req';
import { RideGateway } from 'src/gateways/ride.gateways';
import { RideStopReq } from './requests/rideStop.req';
import { ChangePasswordReq } from '../common/requests/changePassword.req';
import { ProfileRes } from './responses/profile.res';
import { UpdateProfileReq } from 'src/common/requests/updateProfile.req';
import { CommonRes } from 'src/common/responses/common.res';
import { NotificationRes } from 'src/common/responses/notification.res';

@ApiTags("driver")
@Controller('driver')
export class DriverController {
    constructor(
        @Inject(forwardRef(() => DriverService))
        private readonly driverService: DriverService,
        private readonly commonService: CommonService,
        private readonly authService: AuthService,
        private readonly timersGateway: TimersGateway,
        private readonly bookingService: BookingService,
        private readonly riderGateway: RideGateway
    ) { }

    //Check drivers's email availability
    @Get('emailAvailability/:email')
    @ApiParam({
        name: "email",
        required: true,
        type: String,
        description: "driver entered email address"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Email not found" })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "Email exist" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "check availability of the driver email" })
    async emailAvailability(@Param("email") email: string, @Res() res: Response) {
        try {
            const resp: boolean = await this.driverService.emailAvilability(email);
            if (resp) {
                return res.status(HttpStatus.CONFLICT).json("Email exist");
            }
            return res.status(HttpStatus.OK).json("Email not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Driver signin
    @Post('signin')
    @ApiResponse({ status: HttpStatus.OK, description: "Driver ID", type: SignInResponse })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Mismatched" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Driver not found" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "driver signin" })
    async signin(@Body() signinDto: SignInDto, @Res() res: Response) {
        try {
            const driver = await this.driverService.signin(signinDto.userName);
            if (driver) {
                const isMatched = await this.commonService.passwordDecrypt(driver.password, signinDto.password);
                if (isMatched) {
                    const access_token = await this.authService.signin(driver.id, driver.email);
                    return res.status(HttpStatus.OK).json(access_token)
                }
                return res.status(HttpStatus.NOT_ACCEPTABLE).json("Mismatched");
            }
            return res.status(HttpStatus.NOT_FOUND).json("Driver not found");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get assigned vehicle
    @UseGuards(AuthGuard)
    @Get('myVehicle/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "driver Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Assigned vehicle" })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "No any assign vehicle" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get assigned vehicle by driver" })
    async getAssignVehicle(@Param('id') id: string, @Res() res: Response) {
        try {
            const vehicle = await this.driverService.getAssignedVehicle(id);
            if (!vehicle) return res.status(HttpStatus.NOT_FOUND).json("No any assign vehicle");
            const resp: any = {};
            resp.id = vehicle.id;
            resp.type = vehicle.type;
            resp.regNo = vehicle.regNo;
            resp.preferredArea = vehicle.preferredArea;
            resp.capacity = vehicle.capacity;
            resp.capacityUnit = vehicle.capacityUnit;
            resp.photoUrl = vehicle.photoUrl;
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get available bookings
    @UseGuards(AuthGuard)
    @Get('myBookings/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "driver Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of bookings" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get bookings list by driver" })
    async getBookings(@Param('id') id: string, @Res() res: Response) {
        try {
            const response = [];
            const vehicle = await this.driverService.getAssignedVehicle(id);
            if (vehicle) {
                const bookings = await this.driverService.getBookings(vehicle);
                if (bookings.length !== 0) {
                    for (const booking of bookings) {
                        const book: any = {};
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
                if(sBookings.length !== 0) {
                    for(const booking of sBookings) {
                        const book: any = {};
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
            return res.status(HttpStatus.OK).json(sortedResponse);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get available shared bookings
    @UseGuards(AuthGuard)
    @Get('sharedBookings/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Available shared booking" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get available shared booking" })
    async getSharedBookings(@Param('id') id: string, @Res() res: Response) {
        try {
            const response = [];
            const resp = await this.driverService.getSharedBooking(id);
            if (resp.length !== 0) {
                for (const booking of resp) {
                    const obj: any = {};
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
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get location coordinates of booking
    @UseGuards(AuthGuard)
    @Get('getCoordinates/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: "booking Id"
    })
    @ApiQuery({
        name: 'bookingType',
        required: true,
        type: String,
        description: "booking type",
        enum: ["original", "shared"]
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Coordinates of the locations", type: CoordinatesRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get location coordinates of bookings" })
    async getBookingsCoordinates(@Param('id') id: string, @Query('bookingType') bookingType: string, @Res() res: Response) {
        try {
            if (bookingType === "original" || bookingType === "shared") {
                const resp = await this.bookingService.getBookingsCoordinates(id, bookingType);
                return res.status(HttpStatus.OK).json(resp);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Start loading timer of the booking
    @UseGuards(AuthGuard)
    @Post('startLoading/:id')
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "booking Id"
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Loading timer started" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "start the loading timer" })
    async startLoadingTimer(@Param("id") id: string, @Res() res: Response) {
        try {
            this.timersGateway.startLoadingTimer(id);
            return res.status(HttpStatus.OK).json("Loading timer started")
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Stop loading timer of the booking
    @UseGuards(AuthGuard)
    @Put('stopLoading/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Loading timer stopped" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "stop the loading timer" })
    async stopLoadingTimer(@Body() timerReq: TimerReq, @Param("id") id: string, @Res() res: Response) {
        try {
            if (timerReq.bookingType === "original" || timerReq.bookingType === "shared") {
                await this.timersGateway.stopLoadingTimer(timerReq, id);
                return res.status(HttpStatus.OK).json("Loading timer stopped")
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type")
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Start unloading timer of the booking
    @UseGuards(AuthGuard)
    @Post('startUnloading/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Unloading timer started" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: 'start the unloading timer' })
    async startUnloadingTimer(@Param('id') id: string, @Res() res: Response) {
        try {
            this.timersGateway.startUnloadingTimer(id);
            return res.status(HttpStatus.OK).json("Unloading timer started")
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Stop unloading timer of the booking
    @UseGuards(AuthGuard)
    @Put('stopUnloading/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'booking Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Unloading timer stopped", type: BookingCompleteRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "stop the unloading timer" })
    async stopUnloadingTimer(@Body() timerReq: TimerReq, @Param("id") id: string, @Res() res: Response) {
        try {
            if (timerReq.bookingType === "original" || timerReq.bookingType === "shared") {
                const resp = await this.timersGateway.stopUnloadingTimer(timerReq, id);
                return res.status(HttpStatus.OK).json(resp);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Start ride
    @UseGuards(AuthGuard)
    @Post('startRide')
    @ApiResponse({ status: HttpStatus.OK, description: "Ride started successfully" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid booking type" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "start the ride" })
    async startRide(@Body() rideStartReq: RideStartReq, @Res() res: Response) {
        try {
            if (rideStartReq.bookingType === 'original' || rideStartReq.bookingType === 'shared') {
                const resp = await this.driverService.startRide(rideStartReq);
                const html: HTML = new HTML(resp.booking.customer.firstName, resp.booking.customer.lastName);
                const message = html.startRide(resp.driver.firstName, resp.driver.lastName, resp.driver.phoneNumber, resp.booking.id)
                await this.commonService.sendNotifications(resp.booking.customer.email, "Your Driver Is On the Way! Ride and Contact Details Inside", message);
                return res.status(HttpStatus.OK).json("Ride started successfully");
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type");
            }
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Send coordinates
    @UseGuards(AuthGuard)
    @Post('sendCoordinates')
    @ApiResponse({ status: HttpStatus.OK, description: "Coordinates sent successfully" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "send current location coordinates" })
    sendCorrdinates(@Body() coordReq: SendCoordReq, @Res() res: Response) {
        try {
            this.riderGateway.sendCoordinates(coordReq);
            return res.status(HttpStatus.OK).json("Coordinates sent successfully");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Stop ride
    @UseGuards(AuthGuard)
    @Put('stopRide/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'driverId'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Ride stopped successfully" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "stop the ride" })
    async stopRide(@Param('id') driverId: string, @Body() rideStopReq: RideStopReq, @Res() res: Response) {
        try {
            if ((rideStopReq.bookingType === 'original' || rideStopReq.bookingType === 'shared') &&
                (rideStopReq.rideType === 'pickup' || rideStopReq.rideType === 'destination')) {
                const resp = await this.driverService.stopRide(driverId, rideStopReq);
                const html: HTML = new HTML(resp.cusFName, resp.cusLName);

                if (rideStopReq.rideType === 'pickup') {
                    const message = html.driverAtPickupLoc(rideStopReq.bookingId, resp.driverFName, resp.driverLName, resp.driverLName);
                    await this.commonService.sendNotifications(resp.email, 'Your driver is at the pickup location!', message);
                } else {
                    const message = html.driverAtUnloadingLoc(rideStopReq.bookingId, resp.driverFName, resp.driverLName, resp.driverLName);
                    await this.commonService.sendNotifications(resp.email, 'Your druve is at the unloading location!', message);
                }
                return res.status(HttpStatus.OK).json("Ride stopped successfully");
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json("Invalid booking type or ride type");
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
        description: 'driver Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Password changed successfully" })
    @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: "Old password mismatched" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "change driver password" })
    async changeDriverPassword(@Body() passwordReq: ChangePasswordReq, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.driverService.changePassword(id, passwordReq);
            if (resp) {
                return res.status(HttpStatus.OK).json("Password changed successfully");
            }
            return res.status(HttpStatus.NOT_ACCEPTABLE).json("Old password mismatched");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get driver profile
    @UseGuards(AuthGuard)
    @Get('profile/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'driver Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Profile data", type: ProfileRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get driver's profile" })
    async getProfile(@Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.driverService.getProfile(id);
            const profile: ProfileRes = new ProfileRes();
            profile.firstName = resp.firstName;
            profile.lastName = resp.lastName;
            profile.address = resp.address;
            profile.phoneNo = resp.phoneNumber;
            profile.email = resp.email;
            profile.profilePic = resp.photoUrl;
            profile.heavyVehicle = resp.heavyVehicleLic;
            return res.status(HttpStatus.OK).json(profile);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Update owner profile
    @UseGuards(AuthGuard)
    @Put('profile/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'driver Id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "Profile id", type: CommonRes })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "update driver's profile" })
    async updateProfile(@Body() profileUpdate: UpdateProfileReq, @Param('id') id: string, @Res() res: Response) {
        try {
            const resp = await this.driverService.updateProfile(id, profileUpdate);
            const commonRes: CommonRes = new CommonRes();
            commonRes.id = resp.id;
            return res.status(HttpStatus.OK).json(commonRes);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    //Get notifications of the driver
    @UseGuards(AuthGuard)
    @Get('notification/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'driver id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of notifications", type: [NotificationRes] })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get notifications by driver id" })
    async getNotifications(@Param('id') id: string, @Res() res: Response) {
        try {
            const response: NotificationRes[] = [];
            const resp = await this.driverService.getNotifications(id);
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
}