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
exports.NotificationGateway = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const customer_entity_1 = require("../customer/entities/customer.entity");
const customerNotification_entity_1 = require("../customer/entities/customerNotification.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
const driverNotification_entity_1 = require("../driver/entities/driverNotification.entity");
const owner_entity_1 = require("../owner/entities/owner.entity");
const ownerNotification_entity_1 = require("../owner/entities/ownerNotification.entity");
const typeorm_2 = require("typeorm");
let NotificationGateway = class NotificationGateway {
    constructor(customerNotifyRepo, ownerNotifyRepo, driverNotifyRepo, customerRepo, ownerRepo, driverRepo) {
        this.customerNotifyRepo = customerNotifyRepo;
        this.ownerNotifyRepo = ownerNotifyRepo;
        this.driverNotifyRepo = driverNotifyRepo;
        this.customerRepo = customerRepo;
        this.ownerRepo = ownerRepo;
        this.driverRepo = driverRepo;
        this.clients = new Set();
    }
    afterInit(server) {
        console.log("Timer gateway initialized");
    }
    handleConnection(client) {
        console.log('Client connected: ', client.id);
        this.clients.add(client);
    }
    handleDisconnect(client) {
        console.log("Client disconnected: ", client.id);
        this.clients.delete(client);
    }
    joinCustomerNotifyRoom(client, customerId) {
        client.join(customerId);
    }
    leaveCustomerNotifyRoom(client, customerId) {
        client.leave(customerId);
    }
    joinOwnerNotifyRoom(client, ownerId) {
        client.join(ownerId);
    }
    leaveOwnerNotifyRoom(client, ownerId) {
        client.join(ownerId);
    }
    joinDriverNotifyRoom(client, driverId) {
        client.join(driverId);
    }
    leaveDriverNotifyRoom(client, driverId) {
        client.join(driverId);
    }
    async sendCustomerNotification(request) {
        this.server.to(request.userId).emit('notification', { request });
        const customer = await this.customerRepo.findOne({
            where: {
                id: request.userId
            }
        });
        const customerNotification = new customerNotification_entity_1.CustomerNotification();
        customerNotification.date = request.timeStamp;
        customerNotification.date = request.timeStamp;
        customerNotification.title = request.title;
        customerNotification.message = request.message;
        customerNotification.customer = customer;
        await this.customerNotifyRepo.save(customerNotification);
        return;
    }
    async sendOwnerNotification(request) {
        this.server.to(request.userId).emit('notification', { request });
        const owner = await this.ownerRepo.findOne({
            where: {
                id: request.userId
            }
        });
        const ownerNotification = new ownerNotification_entity_1.OwnerNotification();
        ownerNotification.date = request.timeStamp;
        ownerNotification.title = request.title;
        ownerNotification.message = request.message;
        ownerNotification.owner = owner;
        await this.ownerNotifyRepo.save(ownerNotification);
        return;
    }
    async sendDriverNotification(request) {
        this.server.to(request.userId).emit('notification', { request });
        const driver = await this.driverRepo.findOne({
            where: {
                id: request.userId
            }
        });
        const driverNotification = new driverNotification_entity_1.DriverNotification;
        driverNotification.date = request.timeStamp;
        driverNotification.title = request.title;
        driverNotification.message = request.message;
        driverNotification.driver = driver;
        await this.driverNotifyRepo.save(driverNotification);
        return;
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinCustomerNotifyRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "joinCustomerNotifyRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveCustomerNotifyRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "leaveCustomerNotifyRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinOwnerNotifyRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "joinOwnerNotifyRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveOwnerNotifyRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "leaveOwnerNotifyRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinDriverNotifyRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "joinDriverNotifyRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveDriverNotifyRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "leaveDriverNotifyRoom", null);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*"
        }
    }),
    __param(0, (0, typeorm_1.InjectRepository)(customerNotification_entity_1.CustomerNotification)),
    __param(1, (0, typeorm_1.InjectRepository)(ownerNotification_entity_1.OwnerNotification)),
    __param(2, (0, typeorm_1.InjectRepository)(driverNotification_entity_1.DriverNotification)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(5, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map