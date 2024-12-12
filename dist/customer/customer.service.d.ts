import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CustomerDto } from './dtos/cutomer.dto';
import { CommonService } from 'src/common/common.service';
import { ChangePasswordReq } from 'src/common/requests/changePassword.req';
import { CustomerRewards } from './entities/customerRewards.entity';
import { UpdateProfileReq } from 'src/common/requests/updateProfile.req';
import { CustomerNotification } from './entities/customerNotification.entity';
import { CustomerFeedback } from 'src/common/entities/customerFeedback.entity';
import { FeedbackReq } from './requests/feedback.req';
export declare class CustomerService {
    private customerRepo;
    private rewardsRepo;
    private notificationRepo;
    private feedbackRepo;
    private commonService;
    constructor(customerRepo: Repository<Customer>, rewardsRepo: Repository<CustomerRewards>, notificationRepo: Repository<CustomerNotification>, feedbackRepo: Repository<CustomerFeedback>, commonService: CommonService);
    createCustomer(customerDto: CustomerDto): Promise<Customer>;
    emailAvilability(email: string): Promise<boolean>;
    signin(email: string): Promise<Customer>;
    changePassword(id: string, passwordReq: ChangePasswordReq): Promise<Customer>;
    getRewards(cusId: string): Promise<CustomerRewards[]>;
    getProfile(id: string): Promise<Customer>;
    updateProfile(id: string, updateReq: UpdateProfileReq): Promise<Customer>;
    getNotifications(id: string): Promise<CustomerNotification[]>;
    makeFeedback(customerId: string, feedback: FeedbackReq): Promise<CustomerFeedback>;
}
