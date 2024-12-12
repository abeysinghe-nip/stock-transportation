import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Chat } from "src/chat/entities/chat.entity";
import { ChatReq } from "src/chat/requests/chat.req";
import { Customer } from "src/customer/entities/customer.entity";
import { Owner } from "src/owner/entities/owner.entity";
import { Repository } from "typeorm";
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private chatRepo;
    private ownerRepo;
    private customerRepo;
    constructor(chatRepo: Repository<Chat>, ownerRepo: Repository<Owner>, customerRepo: Repository<Customer>);
    private clients;
    server: Server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: any): void;
    joinCustomerNotifyRoom(client: Socket, ownerId: string): void;
    leaveCustomerNotifyRoom(client: Socket, ownerId: string): void;
    sendMessage(chatReq: ChatReq): Promise<void>;
}
