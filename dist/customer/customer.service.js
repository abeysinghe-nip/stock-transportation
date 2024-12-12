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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const typeorm_2 = require("typeorm");
const common_service_1 = require("../common/common.service");
const customerRewards_entity_1 = require("./entities/customerRewards.entity");
const customerNotification_entity_1 = require("./entities/customerNotification.entity");
const customerFeedback_entity_1 = require("../common/entities/customerFeedback.entity");
let CustomerService = class CustomerService {
    constructor(customerRepo, rewardsRepo, notificationRepo, feedbackRepo, commonService) {
        this.customerRepo = customerRepo;
        this.rewardsRepo = rewardsRepo;
        this.notificationRepo = notificationRepo;
        this.feedbackRepo = feedbackRepo;
        this.commonService = commonService;
    }
    async createCustomer(customerDto) {
        const customer = new customer_entity_1.Customer();
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
    async emailAvilability(email) {
        const customer = await this.customerRepo.findOne({ where: { email: email } });
        if (customer)
            return true;
        return false;
    }
    async signin(email) {
        return await this.customerRepo.findOne({ where: { email: email } });
    }
    async changePassword(id, passwordReq) {
        const customer = await this.customerRepo.findOne({
            where: {
                id: id
            }
        });
        const isMatch = await this.commonService.passwordDecrypt(customer.password, passwordReq.oldPassword);
        if (isMatch) {
            const newPw = await this.commonService.passwordEncrypt(passwordReq.newPassword);
            customer.password = newPw;
            return await this.customerRepo.save(customer);
        }
        return undefined;
    }
    async getRewards(cusId) {
        return await this.rewardsRepo.createQueryBuilder("rewards")
            .where("rewards.customerId = :customerId", { customerId: cusId })
            .getMany();
    }
    async getProfile(id) {
        return await this.customerRepo.findOne({
            where: {
                id: id
            }
        });
    }
    async updateProfile(id, updateReq) {
        const customer = await this.customerRepo.findOne({
            where: {
                id: id
            }
        });
        customer.mobileNum = updateReq.mobileNo;
        customer.profilePic = updateReq.profilePic;
        return await this.customerRepo.save(customer);
    }
    async getNotifications(id) {
        return await this.notificationRepo.createQueryBuilder("notification")
            .where('notification.customerId = :customerId', { customerId: id })
            .orderBy('notification.date', 'DESC')
            .getMany();
    }
    async makeFeedback(customerId, feedback) {
        const customer = await this.customerRepo.findOne({
            where: {
                id: customerId
            }
        });
        const newFeedback = new customerFeedback_entity_1.CustomerFeedback();
        newFeedback.createdAt = new Date();
        newFeedback.feedback = feedback.feedback;
        newFeedback.customer = customer;
        return await this.feedbackRepo.save(newFeedback);
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(customerRewards_entity_1.CustomerRewards)),
    __param(2, (0, typeorm_1.InjectRepository)(customerNotification_entity_1.CustomerNotification)),
    __param(3, (0, typeorm_1.InjectRepository)(customerFeedback_entity_1.CustomerFeedback)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        common_service_1.CommonService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map