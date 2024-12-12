import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';
import { OwnerDto } from './dtos/owner.dto';
import { TempOwner } from './entities/tempOwner.entity';
import { CommonService } from 'src/common/common.service';
import { AssignDriverReq } from './requests/assignDriver.req';
import { DriverVehicle } from 'src/driver/entities/driver.vehicle.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { CommonRes } from 'src/common/responses/common.res';
import { ChangePasswordReq } from 'src/common/requests/changePassword.req';
import { OwnerWallet } from './entities/ownerWallet.entity';
import { WalletRes } from './responses/wallet.res';
import { OwnerCredit } from './entities/ownerCredit.entity';
import { OwnerDebit } from './entities/ownerDebit.entity';
import { OwnerTransDto } from './dtos/transaction.dto';
import { BankAccReq } from './requests/bankAcc.req';
require('dotenv').config();
import * as dwolla from 'dwolla-v2';
import { WithdrawalReq } from './requests/withdrawal.req';
import { OwnerRewards } from './entities/ownerRewards.entity';
import { UpdateProfileReq } from 'src/common/requests/updateProfile.req';
import { OwnerNotification } from './entities/ownerNotification.entity';

@Injectable()
export class OwnerService {
    constructor(
        @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
        @InjectRepository(TempOwner) private tempOwnerRepo: Repository<TempOwner>,
        @InjectRepository(DriverVehicle) private driverVehicleRepo: Repository<DriverVehicle>,
        @InjectRepository(Driver) private driverRepo: Repository<Driver>,
        @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
        @InjectRepository(OwnerWallet) private walletRepo: Repository<OwnerWallet>,
        @InjectRepository(OwnerCredit) private creditRepo: Repository<OwnerCredit>,
        @InjectRepository(OwnerDebit) private debitRepo: Repository<OwnerDebit>,
        @InjectRepository(OwnerRewards) private rewardsRepo: Repository<OwnerRewards>,
        @InjectRepository(OwnerNotification) private notificationRepo: Repository<OwnerNotification>,
        private readonly commonService: CommonService
    ) { }

    //Create owner
    async create(ownerDto: OwnerDto) {
        const owner = new TempOwner();
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

    //Owner's email availability
    async emailAvilability(email: string) {
        const owner = await this.ownerRepo.findOne({ where: { email: email } });
        const tempOwner = await this.tempOwnerRepo.findOne({ where: { email: email } });
        if (owner || tempOwner) {
            return true;
        }
        return false;
    }

    //Get owner by email
    async signin(email: string) {
        return await this.ownerRepo.findOne({ where: { email: email } });
    }

    //Assign driver for vehicle
    async assignDriver(assignVehicle: AssignDriverReq) {
        const driverVehicle: DriverVehicle = new DriverVehicle();
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

    //Get all assigned drivers
    async getAssignedDrivers(ownerId: string) {
        return await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.driver", "driver")
            .leftJoinAndSelect("driverVehicle.vehicle", "vehicle")
            .where("driverVehicle.ownerId = :ownerId", { ownerId })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getMany()

    }

    //Get all unassigned drivers
    async getUnassigendDrivers(ownerId: string) {
        const assignedDrivers = await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.driver", "driver")
            .where("driverVehicle.ownerId = :ownerId", { ownerId })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getMany()

        const drivers = await this.driverRepo.createQueryBuilder("driver")
            .where("driver.ownerId = :ownerId", { ownerId })
            .andWhere("driver.enabled = :enabled", { enabled: true })
            .andWhere("driver.deleted = :deleted", { deleted: false })
            .getMany()

        let response: Driver[] = [];

        if (assignedDrivers.length !== 0) {
            for (const driver of drivers) {
                const available = assignedDrivers.filter(assignedD =>
                    assignedD.driver.id === driver.id
                );
                if (available.length === 0) {
                    response.push(driver);
                }
            }
        } else {
            response = drivers;
        }
        return response;
    }

    //Get all unassigned vehicles
    async getUnassigendVehicles(ownerId: string) {
        const assignedVehicles = await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.vehicle", "vehicle")
            .where("driverVehicle.ownerId = :ownerId", { ownerId })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getMany()

        const vehicles = await this.vehicleRepo.createQueryBuilder("vehicle")
            .where("vehicle.ownerId = :ownerId", { ownerId })
            .andWhere("vehicle.enabled = :enabled", { enabled: true })
            .andWhere("vehicle.deleted = :deleted", { deleted: false })
            .getMany()

        let response: Vehicle[] = [];

        if (assignedVehicles.length !== 0) {
            for (const vehicle of vehicles) {
                const available = assignedVehicles.filter(assignedVehi =>
                    assignedVehi.vehicle.id === vehicle.id
                )
                if (available.length === 0) {
                    response.push(vehicle);
                }
            }
        } else {
            response = vehicles;
        }
        return response;
    }

    //Unassign the driver
    async unassignDriver(assignId: string) {
        const assignDriver = await this.driverVehicleRepo.findOne({
            where: {
                id: assignId
            }
        })

        assignDriver.removedDate = new Date();

        return await this.driverVehicleRepo.save(assignDriver);
    }

    //Get vehicle with asssigned driver by assigned id
    async getDriverVehicles(vehicleId: string): Promise<DriverVehicle> {
        return await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .leftJoinAndSelect("driverVehicle.driver", "driver")
            .leftJoinAndSelect("driverVehicle.vehicle", "vehicle")
            .where("driverVehicle.vehicleId = :vehicleId", { vehicleId })
            .getOne()
    }

    //Get disable drivers by owner id
    async getDrivers(id: string): Promise<Driver[]> {
        return await this.driverRepo.createQueryBuilder("driver")
            .where("driver.ownerId = :id", { id })
            .andWhere("driver.deleted = :deleted", { deleted: false })
            .getMany()
    }

    //Disable driver
    async disableDriver(driverId: string): Promise<CommonRes> {
        const commonRes: CommonRes = new CommonRes();
        const assignendVehicle = await this.driverVehicleRepo.createQueryBuilder("driverVehicle")
            .where("driverVehicle.driverId = :driverId", { driverId })
            .andWhere("driverVehicle.removedDate IS NULL")
            .getOne()

        if (assignendVehicle) return commonRes;
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

    //Enable driver
    async enableDriver(driverId: string): Promise<CommonRes> {
        const driver = await this.driverRepo.findOne({
            where: {
                id: driverId
            }
        })
        driver.enabled = true;
        await this.driverRepo.save(driver);
        const commonRes: CommonRes = new CommonRes();
        commonRes.id = driver.id;
        return commonRes;
    }

    //Change password
    async changePassword(id: string, passwordReq: ChangePasswordReq): Promise<Owner> {
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

    //Get wallet data
    async getWalletData(id: string): Promise<WalletRes> {
        const wallet = await this.walletRepo.createQueryBuilder("wallet")
            .where("wallet.ownerId = :ownerId", { ownerId: id })
            .getOne();

        if (!wallet) {
            return undefined;
        }

        const walletRes: WalletRes = new WalletRes();
        walletRes.id = wallet.id;
        walletRes.earnings = wallet.earnings;
        walletRes.withdrawels = wallet.withdrawals;
        walletRes.balance = wallet.earnings - wallet.withdrawals;

        const transactions: OwnerTransDto[] = [];

        //Get creidt data
        const credit = await this.creditRepo.createQueryBuilder("credit")
            .where("credit.walletId = :walletId", { walletId: wallet.id })
            .getMany();

        if (credit.length !== 0) {
            for (const c of credit) {
                const transaction: OwnerTransDto = new OwnerTransDto();
                transaction.id = c.id;
                transaction.date = c.date;
                transaction.type = "credit";
                transaction.amount = c.amount;
                transactions.push(transaction);
            }
        }

        //Get debit data
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
                const transaction: any = {};
                transaction.id = d.id;
                transaction.date = d.date;
                transaction.type = "debit";

                const index = rewards.findIndex(r => r.ownerDebit.id === d.id);
                if(index !== -1) {
                    transaction.rewards = rewards[index].rewardAmount;
                }
                
                transaction.amount = d.amount;
                transactions.push(transaction);
            }
        }
        //Sort transactions by the date
        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        walletRes.transactions = transactions;

        return walletRes;
    }

    //create bank account
    async createBankAccount(id: string, bankReq: BankAccReq): Promise<OwnerWallet> {
        const owner = await this.ownerRepo.findOne({
            where: {
                id: id
            }
        })
        const client = new dwolla.Client({
            key: process.env.DWOLLA_KEY,
            secret: process.env.DWOLLA_SECRET,
            environment: 'sandbox'
        })

        //Create Customer
        const customerResponse = await client.post('customers', {
            firstName: bankReq.firstName,
            lastName: bankReq.lastName,
            email: owner.email,
            type: 'receive-only' // Can be 'receive-only', 'personal', or 'business'
        });

        const customerUrl = customerResponse.headers.get('location');

        const fundingSourceResponse = await client.post(`${customerUrl}/funding-sources`, {
            routingNumber: "222222226",
            accountNumber: "55667788",
            bankAccountType: "checking", // 'checking' or 'savings'
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
        } else {
            const newWallet: OwnerWallet = new OwnerWallet();
            newWallet.holderName = `${bankReq.firstName} ${bankReq.lastName}`;
            newWallet.bank = bankReq.bank;
            newWallet.branch = bankReq.branch;
            newWallet.accNumber = bankReq.account;
            newWallet.dwollaUrl = fundingSource;
            newWallet.owner = owner;
            return await this.walletRepo.save(newWallet);
        }
    }

    //Make withdrawal
    async makeWithdrawal(walletId: string, withdrawalReq: WithdrawalReq): Promise<OwnerDebit> {
        const wallet = await this.walletRepo.findOne({
            where: {
                id: walletId
            }
        })

        let reward: OwnerRewards;
        let rewardAmount: number = 0;
        if (withdrawalReq.rewardId !== "") {
            reward = await this.rewardsRepo.findOne({
                where: {
                    id: withdrawalReq.rewardId
                }
            })

            rewardAmount = reward.rewardAmount;
        }

        //Make withdrawal using Dwolla
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

        //Update wallet withdrawals
        wallet.withdrawals = wallet.withdrawals + withdrawalReq.amount;
        await this.walletRepo.save(wallet);

        //Record transaction
        const transaction: OwnerDebit = new OwnerDebit();
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

    //Check bank account availability
    async checkBankAcc(id: string): Promise<OwnerWallet> {
        const wallet = await this.walletRepo.createQueryBuilder('wallet')
            .where('wallet.ownerId = :ownerId', { ownerId: id })
            .getOne();

        if (wallet.bank !== null) {
            return wallet
        }

        return undefined;
    }

    //Get rewards
    async getRewards(ownerId: string): Promise<OwnerRewards[]> {
        return await this.rewardsRepo.createQueryBuilder("rewards")
            .where("rewards.ownerId = :ownerId", { ownerId: ownerId })
            .getMany();
    }

    //Get profile
    async getProfile(id: string): Promise<Owner> {
        return await this.ownerRepo.findOne({
            where: {
                id: id
            }
        })
    }

    //Update profile
    async updateProfile(id: string, updateReq: UpdateProfileReq): Promise<Owner> {
        const owner = await this.ownerRepo.findOne({
            where: {
                id: id
            }
        });

        owner.mobNumber = updateReq.mobileNo;
        owner.profilePic = updateReq.profilePic;

        return await this.ownerRepo.save(owner);
    }

    //Get owner notifications
    async getNotifications(id: string) {
        return await this.notificationRepo.createQueryBuilder("notification")
            .where('notification.ownerId = :ownerId', { ownerId: id })
            .orderBy('notification.date', 'DESC')
            .getMany();
    }
}
