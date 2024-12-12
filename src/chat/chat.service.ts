import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat) private chatRepo: Repository<Chat>
    ) { }

    //get customers chat
    async customerChat(customerId: string) {
        const chats = await this.chatRepo.createQueryBuilder("chat")
            .leftJoinAndSelect("chat.owner", "owner")
            .where("chat.customerId = :customerId", { customerId: customerId })
            .getMany();

        const response: any[] = [];

        if(chats.length !== 0) {
            for(const c of chats) {
                const chatObj:any = {};
                chatObj.ownerId = c.owner.id;
                chatObj.ownerName = c.owner.firstName + ' ' + c.owner.lastName;
                chatObj.messages = JSON.parse(c.messages).messages;
                response.push(chatObj);
            }
        }
        return response;
    }

    //get owner chat
    async ownerChat(ownerId: string) {
        const chats = await this.chatRepo.createQueryBuilder("chat")
            .leftJoinAndSelect("chat.customer", "customer")
            .where("chat.ownerId = :ownerId", { ownerId: ownerId })
            .getMany();

        const response: any[] = [];

        if(chats.length !== 0) {
            for(const c of chats) {
                const chatObj:any = {};
                chatObj.customerId = c.customer.id;
                chatObj.customerName = c.customer.firstName + ' ' + c.customer.lastName;
                chatObj.messages = JSON.parse(c.messages).messages;
                response.push(chatObj);
            }
        }
        return response;
    }
}
