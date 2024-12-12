import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
export declare class ChatService {
    private chatRepo;
    constructor(chatRepo: Repository<Chat>);
    customerChat(customerId: string): Promise<any[]>;
    ownerChat(ownerId: string): Promise<any[]>;
}
