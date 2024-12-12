import { Booking } from "src/booking/enities/booking.entity";
import { RateReview } from "src/booking/enities/rateReview.entity";
import { SharedBooking } from "src/booking/enities/sharedBooking.entity";
import { CustomerRewards } from "./customerRewards.entity";
import { CustomerNotification } from "./customerNotification.entity";
import { Chat } from "src/chat/entities/chat.entity";
import { CustomerOtp } from "src/common/entities/customerOtp.entity";
import { CustomerFeedback } from "src/common/entities/customerFeedback.entity";
export declare class Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    nic: string;
    gender: string;
    mobileNum: string;
    password: string;
    profilePic: string;
    booking: Booking[];
    sharedBooking: SharedBooking;
    rateReview: RateReview[];
    customerRewards: CustomerRewards[];
    customerNotification: CustomerNotification[];
    chat: Chat[];
    customerOtp: CustomerOtp[];
    customerFeedBack: CustomerFeedback[];
}
