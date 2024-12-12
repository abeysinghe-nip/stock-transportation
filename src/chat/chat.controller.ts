import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ChatReq } from './requests/chat.req';
import { ChatGateway } from 'src/gateways/chat.gateway';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly chatGateway: ChatGateway
    ) { }

    @UseGuards(AuthGuard)
    @Post('chat')
    @ApiResponse({ status: HttpStatus.OK, description: "Message has been sent successfully" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "send messages" })
    async sendChat(@Body() chatReq: ChatReq, @Res() res: Response) {
        try {
            await this.chatGateway.sendMessage(chatReq);
            return res.status(HttpStatus.OK).json("Message has been sent successfully");
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    @UseGuards(AuthGuard)
    @Get('chatCustomer/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'customer id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of customer chats" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get customer chat history" })
    async customerChat(@Param('id') customerId: string, @Res() res: Response) {
        try {
            const resp = await this.chatService.customerChat(customerId);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

    @UseGuards(AuthGuard)
    @Get('chatOwner/:id')
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
        description: 'owner id'
    })
    @ApiResponse({ status: HttpStatus.OK, description: "List of owner chats" })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized user" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Internal server error" })
    @ApiOperation({ summary: "get owner chat history" })
    async ownerChat(@Param('id') ownerId: string, @Res() res: Response) {
        try {
            const resp = await this.chatService.ownerChat(ownerId);
            return res.status(HttpStatus.OK).json(resp);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal server errror");
        }
    }

}
