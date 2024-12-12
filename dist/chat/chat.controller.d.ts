import { ChatService } from './chat.service';
import { Response } from 'express';
import { ChatReq } from './requests/chat.req';
import { ChatGateway } from 'src/gateways/chat.gateway';
export declare class ChatController {
    private readonly chatService;
    private readonly chatGateway;
    constructor(chatService: ChatService, chatGateway: ChatGateway);
    sendChat(chatReq: ChatReq, res: Response): Promise<Response<any, Record<string, any>>>;
    customerChat(customerId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    ownerChat(ownerId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
