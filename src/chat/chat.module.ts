import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GatewayModule } from 'src/gateways/gateways.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Chat
        ]),
        GatewayModule
    ],
    providers: [
        ChatService,
    ],
    controllers: [
        ChatController
    ]
})
export class ChatModule {}
