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
exports.ChatGateway = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_entity_1 = require("../chat/entities/chat.entity");
const customer_entity_1 = require("../customer/entities/customer.entity");
const owner_entity_1 = require("../owner/entities/owner.entity");
const typeorm_2 = require("typeorm");
let ChatGateway = class ChatGateway {
    constructor(chatRepo, ownerRepo, customerRepo) {
        this.chatRepo = chatRepo;
        this.ownerRepo = ownerRepo;
        this.customerRepo = customerRepo;
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
    joinCustomerNotifyRoom(client, ownerId) {
        client.join(ownerId);
    }
    leaveCustomerNotifyRoom(client, ownerId) {
        client.leave(ownerId);
    }
    async sendMessage(chatReq) {
        const owner = await this.ownerRepo.findOne({
            where: {
                id: chatReq.ownerId
            }
        });
        const customer = await this.customerRepo.findOne({
            where: {
                id: chatReq.customerId
            }
        });
        const chatResp = {
            customerId: chatReq.customerId,
            ownerId: chatReq.ownerId,
            customerName: customer.firstName + ' ' + customer.lastName,
            ownerName: owner.firstName + ' ' + owner.lastName,
            role: chatReq.role,
            timeStamp: new Date(),
            message: chatReq.message
        };
        this.server.to(chatReq.ownerId).emit('chat', { chatResp });
        const chat = await this.chatRepo.createQueryBuilder("chat")
            .where("chat.ownerId = :ownerId", { ownerId: owner.id })
            .andWhere("chat.customerId = :customerId", { customerId: customer.id })
            .getOne();
        if (chat) {
            const messageObj = {
                role: chatReq.role,
                timeStamp: new Date(),
                message: chatReq.message
            };
            const messages = JSON.parse(chat.messages);
            messages.messages.push(messageObj);
            chat.messages = JSON.stringify(messages);
            await this.chatRepo.save(chat);
        }
        else {
            const newChat = new chat_entity_1.Chat();
            newChat.customer = customer;
            newChat.owner = owner;
            newChat.createdDate = new Date();
            const messagesArray = [];
            const messages = {
                messages: []
            };
            const messageObj = {
                role: chatReq.role,
                timeStamp: new Date(),
                message: chatReq.message
            };
            messagesArray.push(messageObj);
            messages.messages = messagesArray;
            newChat.messages = JSON.stringify(messages);
            await this.chatRepo.save(newChat);
        }
        return;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChatRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "joinCustomerNotifyRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leavechatRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "leaveCustomerNotifyRoom", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*"
        }
    }),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(1, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map