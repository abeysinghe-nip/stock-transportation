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
exports.OwnerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const owner_entity_1 = require("./entities/owner.entity");
const tempOwner_entity_1 = require("./entities/tempOwner.entity");
const common_service_1 = require("../common/common.service");
const driver_vehicle_entity_1 = require("../driver/entities/driver.vehicle.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
const vehicle_entity_1 = require("../vehicle/entities/vehicle.entity");
const common_res_1 = require("../common/responses/common.res");
const ownerWallet_entity_1 = require("./entities/ownerWallet.entity");
const wallet_res_1 = require("./responses/wallet.res");
const ownerCredit_entity_1 = require("./entities/ownerCredit.entity");
const ownerDebit_entity_1 = require("./entities/ownerDebit.entity");
const transaction_dto_1 = require("./dtos/transaction.dto");
require('dotenv').config();
const dwolla = require("dwolla-v2");
const ownerRewards_entity_1 = require("./entities/ownerRewards.entity");
const ownerNotification_entity_1 = require("./entities/ownerNotification.entity");
let OwnerService = class OwnerService {
    constructor(ownerRepo, tempOwnerRepo, driverVehicleRepo, driverRepo, vehicleRepo, walletRepo, creditRepo, debitRepo, rewardsRepo, notificationRepo, commonService) {
        this.ownerRepo = ownerRepo;
        this.tempOwnerRepo = tempOwnerRepo;
        this.driverVehicleRepo = driverVehicleRepo;
        this.driverRepo = driverRepo;
        this.vehicleRepo = vehicleRepo;
        this.walletRepo = walletRepo;
        this.creditRepo = creditRepo;
        this.debitRepo = debitRepo;
        this.rewardsRepo = rewardsRepo;
        this.notificationRepo = notificationRepo;
        this.commonService = commonService;
    }
    async create(ownerDto) {
        const owner = new tempOwner_entity_1.TempOwner();
        owner.firstName = ownerDto.firstName;
        owner.lastName = ownerDto.lastName;
        owner.address = ownerDto.address;
        owner.nic = ownerDto.nic;
        owner.email = ownerDto.email;
        owner.mobNumber = ownerDto.mobNumber;
        owner.password = await this.commonService.passwordEncrypt(ownerDto.password);
        owner.gsCertiUrl = ownerDto.gsCertiUrl;
        return await this.tempOwnerRepo.save(owner);
    }
    async emailAvilability(email) {
        const owner = await this.ownerRepo.findOne({ where: { email: email } });
        const tempOwner = await this.tempOwnerRepo.findOne({ where: { email: email } });
        if (owner || tempOwner) {
            return true;
        }
        return false;
    }
    async signin(email) {
        return await this.ownerRepo.findOne({ where: { email: email } });
    }
    async assignDriver(assignVehicle) {
        const driverVehicle = new driver_vehicle_entity_1.DriverVehicle();
        const driver = await this.driverRepo.findOne({
            where: {
                id: assignVehicle.driverId
            }
        });
        const vehicle = await this.vehicleRepo.findOne({
            where: {
                id: assignVehicle.vehicleId
            }
        });
        const owner = await this.ownerRepo.findOne({
            where: {
                id: assignVehicle.ownerId
            }
        });
        driverVehicle.assignedDate = new Date();
        driverVehicle.driver = driver;
        driverVehicle.vehicle = vehicle;
        driverVehicle.owner = owner;
        return await this.driverVehicleRepo.save(driverVehicle);
    }
    async getAssignedDrivers(ownerId) {
        return await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.driver", "driver")
            .leftJoinAndSelect("driverVehicle.vehicle", "vehicle")
            .where("driverVehicle.ownerId = :ownerId", { ownerId })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getMany();
    }
    async getUnassigendDrivers(ownerId) {
        const assignedDrivers = await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.driver", "driver")
            .where("driverVehicle.ownerId = :ownerId", { ownerId })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getMany();
        const drivers = await this.driverRepo.createQueryBuilder("driver")
            .where("driver.ownerId = :ownerId", { ownerId })
            .andWhere("driver.enabled = :enabled", { enabled: true })
            .andWhere("driver.deleted = :deleted", { deleted: false })
            .getMany();
        let response = [];
        if (assignedDrivers.length !== 0) {
            for (const driver of drivers) {
                const available = assignedDrivers.filter(assignedD => assignedD.driver.id === driver.id);
                if (available.length === 0) {
                    response.push(driver);
                }
            }
        }
        else {
            response = drivers;
        }
        return response;
    }
    async getUnassigendVehicles(ownerId) {
        const assignedVehicles = await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.vehicle", "vehicle")
            .where("driverVehicle.ownerId = :ownerId", { ownerId })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getMany();
        const vehicles = await this.vehicleRepo.createQueryBuilder("vehicle")
            .where("vehicle.ownerId = :ownerId", { ownerId })
            .andWhere("vehicle.enabled = :enabled", { enabled: true })
            .andWhere("vehicle.deleted = :deleted", { deleted: false })
            .getMany();
        let response = [];
        if (assignedVehicles.length !== 0) {
            for (const vehicle of vehicles) {
                const available = assignedVehicles.filter(assignedVehi => assignedVehi.vehicle.id === vehicle.id);
                if (available.length === 0) {
                    response.push(vehicle);
                }
            }
        }
        else {
            response = vehicles;
        }
        return response;
    }
    async unassignDriver(assignId) {
        const assignDriver = await this.driverVehicleRepo.findOne({
            where: {
                id: assignId
            }
        });
        assignDriver.removedDate = new Date();
        return await this.driverVehicleRepo.save(assignDriver);
    }
    async getDriverVehicles(vehicleId) {
        return await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.driver", "driver")
            .leftJoinAndSelect("driverVehicle.vehicle", "vehicle")
            .where("driverVehicle.vehicleId = :vehicleId", { vehicleId })
            .getOne();
    }
    async getDrivers(id) {
        return await this.driverRepo.createQueryBuilder("driver")
            .where("driver.ownerId = :id", { id })
            .andWhere("driver.deleted = :deleted", { deleted: false })
            .getMany();
    }
    async disableDriver(driverId) {
        const commonRes = new common_res_1.CommonRes();
        const assignendVehicle = await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .where("driverVehicle.driverId = :driverId", { driverId })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getOne();
        if (assignendVehicle)
            return commonRes;
        const driver = await this.driverRepo.findOne({
            where: {
                id: driverId
            }
        });
        driver.enabled = false;
        await this.driverRepo.save(driver);
        commonRes.id = driver.id;
        return commonRes;
    }
    async enableDriver(driverId) {
        const driver = await this.driverRepo.findOne({
            where: {
                id: driverId
            }
        });
        driver.enabled = true;
        await this.driverRepo.save(driver);
        const commonRes = new common_res_1.CommonRes();
        commonRes.id = driver.id;
        return commonRes;
    }
    async changePassword(id, passwordReq) {
        const owner = await this.ownerRepo.findOne({
            where: {
                id: id
            }
        });
        const isMatch = await this.commonService.passwordDecrypt(owner.password, passwordReq.oldPassword);
        if (isMatch) {
            const newPw = await this.commonService.passwordEncrypt(passwordReq.newPassword);
            owner.password = newPw;
            return await this.ownerRepo.save(owner);
        }
        return undefined;
    }
    async getWalletData(id) {
        const wallet = await this.walletRepo.createQueryBuilder("wallet")
            .where("wallet.ownerId = :ownerId", { ownerId: id })
            .getOne();
        if (!wallet) {
            return undefined;
        }
        const walletRes = new wallet_res_1.WalletRes();
        walletRes.id = wallet.id;
        walletRes.earnings = wallet.earnings;
        walletRes.withdrawels = wallet.withdrawals;
        walletRes.balance = wallet.earnings - wallet.withdrawals;
        const transactions = [];
        const credit = await this.creditRepo.createQueryBuilder("credit")
            .where("credit.walletId = :walletId", { walletId: wallet.id })
            .getMany();
        if (credit.length !== 0) {
            for (const c of credit) {
                const transaction = new transaction_dto_1.OwnerTransDto();
                transaction.id = c.id;
                transaction.date = c.date;
                transaction.type = "credit";
                transaction.amount = c.amount;
                transactions.push(transaction);
            }
        }
        const debit = await this.debitRepo.createQueryBuilder("debit")
            .where("debit.walletId = :walletId", { walletId: wallet.id })
            .getMany();
        const rewards = await this.rewardsRepo.createQueryBuilder("rewards")
            .leftJoinAndSelect("rewards.ownerDebit", "ownerDebit")
            .where("rewards.isClaimed = :isClaimed", { isClaimed: true })
            .andWhere("rewards.ownerId = :ownerId", { ownerId: id })
            .getMany();
        if (debit.length !== 0) {
            for (const d of debit) {
                const transaction = {};
                transaction.id = d.id;
                transaction.date = d.date;
                transaction.type = "debit";
                const index = rewards.findIndex(r => r.ownerDebit.id === d.id);
                if (index !== -1) {
                    transaction.rewards = rewards[index].rewardAmount;
                }
                transaction.amount = d.amount;
                transactions.push(transaction);
            }
        }
        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        walletRes.transactions = transactions;
        return walletRes;
    }
    async createBankAccount(id, bankReq) {
        const owner = await this.ownerRepo.findOne({
            where: {
                id: id
            }
        });
        const client = new dwolla.Client({
            key: process.env.DWOLLA_KEY,
            secret: process.env.DWOLLA_SECRET,
            environment: 'sandbox'
        });
        const customerResponse = await client.post('customers', {
            firstName: bankReq.firstName,
            lastName: bankReq.lastName,
            email: owner.email,
            type: 'receive-only'
        });
        const customerUrl = customerResponse.headers.get('location');
        const fundingSourceResponse = await client.post(`${customerUrl}/funding-sources`, {
            routingNumber: "222222226",
            accountNumber: "55667788",
            bankAccountType: "checking",
            name: 'My Bank Account'
        });
        const fundingSource = fundingSourceResponse.headers.get('location');
        const wallet = await this.walletRepo.createQueryBuilder('wallet')
            .where('wallet.ownerId = :ownerId', { ownerId: id })
            .getOne();
        if (wallet) {
            wallet.holderName = `${bankReq.firstName} ${bankReq.lastName}`;
            wallet.bank = bankReq.bank;
            wallet.branch = bankReq.branch;
            wallet.accNumber = bankReq.account;
            wallet.dwollaUrl = fundingSource;
            return await this.walletRepo.save(wallet);
        }
        else {
            const newWallet = new ownerWallet_entity_1.OwnerWallet();
            newWallet.holderName = `${bankReq.firstName} ${bankReq.lastName}`;
            newWallet.bank = bankReq.bank;
            newWallet.branch = bankReq.branch;
            newWallet.accNumber = bankReq.account;
            newWallet.dwollaUrl = fundingSource;
            newWallet.owner = owner;
            return await this.walletRepo.save(newWallet);
        }
    }
    async makeWithdrawal(walletId, withdrawalReq) {
        const wallet = await this.walletRepo.findOne({
            where: {
                id: walletId
            }
        });
        let reward;
        let rewardAmount = 0;
        if (withdrawalReq.rewardId !== "") {
            reward = await this.rewardsRepo.findOne({
                where: {
                    id: withdrawalReq.rewardId
                }
            });
            rewardAmount = reward.rewardAmount;
        }
        const client = new dwolla.Client({
            key: process.env.DWOLLA_KEY,
            secret: process.env.DWOLLA_SECRET,
            environment: 'sandbox'
        });
        const amountUSD = ((withdrawalReq.amount + rewardAmount) / 300).toFixed(2);
        var transferRequest = {
            _links: {
                source: {
                    href: "https://api-sandbox.dwolla.com/funding-sources/db5969f2-74e6-4be1-9f2e-f113950f0008",
                },
                destination: {
                    href: wallet.dwollaUrl,
                },
            },
            amount: {
                currency: "USD",
                value: amountUSD,
            },
        };
        await client.post("transfers", transferRequest);
        wallet.withdrawals = wallet.withdrawals + withdrawalReq.amount;
        await this.walletRepo.save(wallet);
        const transaction = new ownerDebit_entity_1.OwnerDebit();
        transaction.date = new Date();
        transaction.amount = withdrawalReq.amount;
        transaction.wallet = wallet;
        const debit = await this.debitRepo.save(transaction);
        if (withdrawalReq.rewardId !== "") {
            reward.isClaimed = true;
            reward.ownerDebit = debit;
            await this.rewardsRepo.save(reward);
        }
        return debit;
    }
    async checkBankAcc(id) {
        const wallet = await this.walletRepo.createQueryBuilder('wallet')
            .where('wallet.ownerId = :ownerId', { ownerId: id })
            .getOne();
        if (wallet.bank !== null) {
            return wallet;
        }
        return undefined;
    }
    async getRewards(ownerId) {
        return await this.rewardsRepo.createQueryBuilder("rewards")
            .where("rewards.ownerId = :ownerId", { ownerId: ownerId })
            .getMany();
    }
    async getProfile(id) {
        return await this.ownerRepo.findOne({
            where: {
                id: id
            }
        });
    }
    async updateProfile(id, updateReq) {
        const owner = await this.ownerRepo.findOne({
            where: {
                id: id
            }
        });
        owner.mobNumber = updateReq.mobileNo;
        owner.profilePic = updateReq.profilePic;
        return await this.ownerRepo.save(owner);
    }
    async getNotifications(id) {
        return await this.notificationRepo.createQueryBuilder("notification")
            .where('notification.ownerId = :ownerId', { ownerId: id })
            .orderBy('notification.date', 'DESC')
            .getMany();
    }
};
exports.OwnerService = OwnerService;
exports.OwnerService = OwnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(1, (0, typeorm_1.InjectRepository)(tempOwner_entity_1.TempOwner)),
    __param(2, (0, typeorm_1.InjectRepository)(driver_vehicle_entity_1.DriverVehicle)),
    __param(3, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(4, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(5, (0, typeorm_1.InjectRepository)(ownerWallet_entity_1.OwnerWallet)),
    __param(6, (0, typeorm_1.InjectRepository)(ownerCredit_entity_1.OwnerCredit)),
    __param(7, (0, typeorm_1.InjectRepository)(ownerDebit_entity_1.OwnerDebit)),
    __param(8, (0, typeorm_1.InjectRepository)(ownerRewards_entity_1.OwnerRewards)),
    __param(9, (0, typeorm_1.InjectRepository)(ownerNotification_entity_1.OwnerNotification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        common_service_1.CommonService])
], OwnerService);
//# sourceMappingURL=owner.service.js.map