import { CustomerService } from './customer.service';
import { Response } from 'express';
import { CustomerDto } from './dtos/cutomer.dto';
import { SignInDto } from 'src/common/requests/signIn.dto';
import { CommonService } from 'src/common/common.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { BookingService } from 'src/booking/booking.service';
import { BookingDto } from 'src/booking/dtos/booking.dto';
import { IntentReq } from './requests/intent.req';
import { BookingCancelDto } from 'src/booking/dtos/bookingCancel.dto';
import { PaymentDto } from 'src/booking/dtos/payment.dto';
import { CalChargeReq } from './requests/calCharge.req';
import { SharedBookingReq } from './requests/sharedBooking.req';
import { BalPaymentReq } from './requests/balPayment.req';
import { RateReviewReq } from './requests/rateReview.req';
import { ChangePasswordReq } from 'src/common/requests/changePassword.req';
import { UpdateProfileReq } from 'src/common/requests/updateProfile.req';
import { AuthService } from 'src/auth/auth.service';
import { FeedbackReq } from './requests/feedback.req';
export declare class CustomerController {
    private readonly customerService;
    private readonly commonService;
    private readonly vehicleService;
    private readonly bookingService;
    private readonly authService;
    constructor(customerService: CustomerService, commonService: CommonService, vehicleService: VehicleService, bookingService: BookingService, authService: AuthService);
    createCustomer(customerDto: CustomerDto, res: Response): Promise<Response<any, Record<string, any>>>;
    emailAvailability(email: string, res: Response): Promise<Response<any, Record<string, any>>>;
    signin(signinDto: SignInDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getVehicles(res: Response): Promise<Response<any, Record<string, any>>>;
    calCharges(calChargeReq: CalChargeReq, res: Response): Promise<Response<any, Record<string, any>>>;
    booking(bookingDto: BookingDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getBookings(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    createPaymentIntent(intentReq: IntentReq, res: Response): Promise<Response<any, Record<string, any>>>;
    recordPayment(type: string, paymentDto: PaymentDto, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    cancelBooking(bookingCancelDto: BookingCancelDto, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getSharedBookings(res: Response): Promise<Response<any, Record<string, any>>>;
    makeSharedBooking(booking: SharedBookingReq, res: Response): Promise<Response<any, Record<string, any>>>;
    cancelSharedBooking(bookingCancelDto: BookingCancelDto, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getSharedBookingByCustomer(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    recordBalPayment(paymentReq: BalPaymentReq, bookingId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    makeRateReview(rateReviewReq: RateReviewReq, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    changeDriverPassword(passwordReq: ChangePasswordReq, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getRewards(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(profileUpdate: UpdateProfileReq, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getPaymentHistory(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getNotifications(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getReturnTrips(res: Response): Promise<Response<any, Record<string, any>>>;
    makeFeedback(id: string, feedback: FeedbackReq, res: Response): Promise<Response<any, Record<string, any>>>;
    getBalancePaymentPendings(customerId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
