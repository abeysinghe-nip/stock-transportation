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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const typeorm_2 = require("typeorm");
let ChatService = class ChatService {
    constructor(chatRepo) {
        this.chatRepo = chatRepo;
    }
    async customerChat(customerId) {
        const chats = await this.chatRepo.createQueryBuilder("chat")
            .leftJoinAndSelect("chat.owner", "owner")
            .where("chat.customerId = :customerId", { customerId: customerId })
            .getMany();
        const response = [];
        if (chats.length !== 0) {
            for (const c of chats) {
                const chatObj = {};
                chatObj.ownerId = c.owner.id;
                chatObj.ownerName = c.owner.firstName + ' ' + c.owner.lastName;
                chatObj.messages = JSON.parse(c.messages).messages;
                response.push(chatObj);
            }
        }
        return response;
    }
    async ownerChat(ownerId) {
        const chats = await this.chatRepo.createQueryBuilder("chat")
            .leftJoinAndSelect("chat.customer", "customer")
            .where("chat.ownerId = :ownerId", { ownerId: ownerId })
            .getMany();
        const response = [];
        if (chats.length !== 0) {
            for (const c of chats) {
                const chatObj = {};
                chatObj.customerId = c.customer.id;
                chatObj.customerName = c.customer.firstName + ' ' + c.customer.lastName;
                chatObj.messages = JSON.parse(c.messages).messages;
                response.push(chatObj);
            }
        }
        return response;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map