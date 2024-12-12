import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer) private customerRepo: Repository<Customer>,
        @InjectRepository(CustomerRewards) private rewardsRepo: Repository<CustomerRewards>,
        @InjectRepository(CustomerNotification) private notificationRepo: Repository<CustomerNotification>,
        @InjectRepository(CustomerFeedback) private feedbackRepo: Repository<CustomerFeedback>,
        private commonService: CommonService,
    ) { }

    //create customer
    async createCustomer(customerDto: CustomerDto): Promise<Customer> {
        const customer: Customer = new Customer();
        customer.firstName = customerDto.firstName;
        customer.lastName = customerDto.lastName;
        customer.email = customerDto.email;
        customer.address = customerDto.address;
        customer.nic = customerDto.nic;
        customer.gender = customerDto.gender;
        customer.mobileNum = customerDto.mobileNum;
        customer.password = await this.commonService.passwordEncrypt(customerDto.password);

        return await this.customerRepo.save(customer);
    }

    //Check email availability of the customer
    async emailAvilability(email: string): Promise<boolean> {
        const customer = await this.customerRepo.findOne({ where: { email: email } });
        if (customer) return true;
        return false;
    }

    //Get owner by email
    async signin(email: string) {
        return await this.customerRepo.findOne({ where: { email: email } });
    }

    //Change password
    async changePassword(id: string, passwordReq: ChangePasswordReq): Promise<Customer> {
        const customer = await this.customerRepo.findOne({
            where: {
                id: id
            }
        })

        const isMatch = await this.commonService.passwordDecrypt(customer.password, passwordReq.oldPassword);
        if (isMatch) {
            const newPw = await this.commonService.passwordEncrypt(passwordReq.newPassword);
            customer.password = newPw;
            return await this.customerRepo.save(customer);
        }
        return undefined;
    }

    //Get rewards
    async getRewards(cusId: string): Promise<CustomerRewards[]> {
        return await this.rewardsRepo.createQueryBuilder("rewards")
            .where("rewards.customerId = :customerId", { customerId: cusId })
            .getMany();
    }

    //Get profile
    async getProfile(id: string): Promise<Customer> {
        return await this.customerRepo.findOne({
            where: {
                id: id
            }
        })
    }

    //Update profile
    async updateProfile(id: string, updateReq: UpdateProfileReq): Promise<Customer> {
        const customer = await this.customerRepo.findOne({
            where: {
                id: id
            }
        });

        customer.mobileNum = updateReq.mobileNo;
        customer.profilePic = updateReq.profilePic;

        return await this.customerRepo.save(customer);
    }

    //Get cutomer notifications
    async getNotifications(id: string) {
        return await this.notificationRepo.createQueryBuilder("notification")
            .where('notification.customerId = :customerId', { customerId: id })
            .orderBy('notification.date', 'DESC')
            .getMany();
    }

    //Make a feedback
    async makeFeedback(customerId: string, feedback: FeedbackReq): Promise<CustomerFeedback> {
        const customer = await this.customerRepo.findOne({
            where: {
                id: customerId
            }
        });

        const newFeedback: CustomerFeedback = new CustomerFeedback();
        newFeedback.createdAt = new Date();
        newFeedback.feedback = feedback.feedback;
        newFeedback.customer = customer;
        return await this.feedbackRepo.save(newFeedback);
    }
}
