import { Booking } from "src/booking/enities/booking.entity";
import { RateReview } from "src/booking/enities/rateReview.entity";
import { SharedBooking } from "src/booking/enities/sharedBooking.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerRewards } from "./customerRewards.entity";
import { CustomerNotification } from "./customerNotification.entity";
import { Chat } from "src/chat/entities/chat.entity";
import { CustomerOtp } from "src/common/entities/customerOtp.entity";
import { CustomerFeedback } from "src/common/entities/customerFeedback.entity";


@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 50 })
    lastName: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ length: 250 })
    address: string;

    @Column({ length: 12, unique: true })
    nic: string;

    @Column({ length: 6 })
    gender: string;

    @Column({ length: 12, unique: true })
    mobileNum: string;

    @Column({ length: 200 })
    password: string;

    @Column({ length: 200, nullable: true })
    profilePic: string;

    @OneToMany(() => Booking, (booking) => booking.customer)
    booking: Booking[]

    @OneToMany(() => SharedBooking, (sharedBooking) => sharedBooking.customer)
    sharedBooking: SharedBooking;

    @OneToMany(() => RateReview, (rateReview) => rateReview.review)
    rateReview: RateReview[];

    @OneToMany(() => CustomerRewards, (customerRewards) => customerRewards.customer)
    customerRewards: CustomerRewards[];

    @OneToMany(() => CustomerNotification, (customerNotification) => customerNotification.customer)
    customerNotification: CustomerNotification[];

    @OneToMany(() => Chat, (chat) => chat.customer)
    chat: Chat[];

    @OneToMany(() => CustomerOtp, (customerOtp) => customerOtp.customer)
    customerOtp: CustomerOtp[];

    @OneToMany(() => CustomerFeedback, (customerFeedback) => customerFeedback.customer)
    customerFeedBack: CustomerFeedback[];
}