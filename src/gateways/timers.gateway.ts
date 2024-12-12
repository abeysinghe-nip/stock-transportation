import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { BookingService } from "src/booking/booking.service";
import { Booking } from "src/booking/enities/booking.entity";
import { SharedBooking } from "src/booking/enities/sharedBooking.entity";

import { TimerReq } from "src/driver/requests/timer.req";
import { BookingCompleteRes } from "src/driver/responses/bookingComplete.res";

@WebSocketGateway({
    cors: {
        origin: "*"
    }
})
export class TimersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly bookingService: BookingService
    ) { }

    private clients: Set<Socket> = new Set();
    private timers: Map<string, { startTime: number, intervalId: NodeJS.Timeout }> = new Map();

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

    @SubscribeMessage('joinLoadigRoom')
    joinLoadingRoom(client: Socket, bookingID: string) {
        client.join(bookingID);
    }

    @SubscribeMessage('leaveLoadingRoom')
    leaveLoadingRoom(client: Socket, bookingId: string) {
        client.leave(bookingId);
    }

    @SubscribeMessage('joinUnloadingRoom')
    joinUnloadingRoom(client: Socket, bookingId: string) {
        client.join(bookingId);
    }

    @SubscribeMessage('leaveUnloadingRoom')
    leaveUnloadingRoom(client: Socket, bookingId: string) {
        client.leave(bookingId);
    }

    startLoadingTimer(bookingId: string) {
        if (this.timers.has(bookingId)) {
            clearInterval(this.timers.get(bookingId).intervalId);
            this.timers.delete(bookingId);
        }

        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const loadingTime = this.formatTime(elapsedTime);
            this.server.to(bookingId).emit('timerUpdate', { loadingTime })
        }, 1000);

        this.timers.set(bookingId, { startTime, intervalId });
    }

    async stopLoadingTimer(timerReq: TimerReq, bookingId: string): Promise<Booking | SharedBooking> {
        if (this.timers.has(bookingId)) {
            const { startTime, intervalId } = this.timers.get(bookingId);
            clearInterval(intervalId);
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            this.timers.delete(bookingId);
            if (timerReq.bookingType === "original") {
                return await this.bookingService.updateBookingLoadingTime(bookingId, elapsedTime);
            } else {
                return await this.bookingService.updateSharedBookingLoadingTime(bookingId, elapsedTime);
            }
        }
    }

    startUnloadingTimer(bookingId: string) {
        if (this.timers.has(bookingId)) {
            clearInterval(this.timers.get(bookingId).intervalId);
            this.timers.delete(bookingId);
        }
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const unloadingTime = this.formatTime(elapsedTime);
            this.server.to(bookingId).emit('timerUpdate', { unloadingTime });
        }, 1000);

        this.timers.set(bookingId, { startTime, intervalId });
    }

    async stopUnloadingTimer(timerReq: TimerReq, bookingId: string): Promise<BookingCompleteRes> {
        if (this.timers.has(bookingId)) {
            const { startTime, intervalId } = this.timers.get(bookingId);
            clearInterval(intervalId);
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            this.timers.delete(bookingId);
            this.server.to(bookingId).emit('timerUpdate', { status: 'stopped' });
            if (timerReq.bookingType === "original") {
                return await this.bookingService.updateBookingUnloadingTime(bookingId, elapsedTime);
            } else {
                return await this.bookingService.updateSharedBookingUnloadingTime(bookingId, elapsedTime);
            }
        }
    }

    //-----------------------------private methods-----------------------------

    private formatTime(ms: number): string {
        const hours = Math.floor(ms / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((ms % 3600) / 60).toString().padStart(2, '0');
        const seconds = (ms % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
}