import { InjectRepository } from "@nestjs/typeorm";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Chat } from "src/chat/entities/chat.entity";
import { ChatReq } from "src/chat/requests/chat.req";
import { Customer } from "src/customer/entities/customer.entity";
import { Owner } from "src/owner/entities/owner.entity";
import { json } from "stream/consumers";
import { Repository } from "typeorm";

@WebSocketGateway({
    cors: {
        origin: "*"
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @InjectRepository(Chat) private chatRepo: Repository<Chat>,
        @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
        @InjectRepository(Customer) private customerRepo: Repository<Customer>

    ) { }

    private clients: Set<Socket> = new Set();

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log("Timer gateway initialized");
    }

    handleConnection(client: Socket) {
        console.log('Client connected: ', client.id);
        this.clients.add(client);
    }

    handleDisconnect(client: any) {
        console.log("Client disconnected: ", client.id);
        this.clients.delete(client);
    }

    @SubscribeMessage('joinChatRoom')
    joinCustomerNotifyRoom(client: Socket, ownerId: string) {
        client.join(ownerId);
    }

    @SubscribeMessage('leavechatRoom')
    leaveCustomerNotifyRoom(client: Socket, ownerId: string) {
        client.leave(ownerId);
    }

    async sendMessage(chatReq: ChatReq) {
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

        const chatResp: any = {
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
            const messageObj: any = {
                role: chatReq.role,
                timeStamp: new Date(),
                message: chatReq.message
            }
            const messages = JSON.parse(chat.messages);
            messages.messages.push(messageObj);
            chat.messages = JSON.stringify(messages);
            await this.chatRepo.save(chat);
        } else {
            const newChat: Chat = new Chat();
            newChat.customer = customer;
            newChat.owner = owner;
            newChat.createdDate = new Date();

            const messagesArray: any[] = [];

            const messages = {
                messages: []
            };

            const messageObj: any = {
                role: chatReq.role,
                timeStamp: new Date(),
                message: chatReq.message
            }
            messagesArray.push(messageObj);
            messages.messages = messagesArray;
            newChat.messages = JSON.stringify(messages);
            await this.chatRepo.save(newChat);
        }
        return;
    }
}