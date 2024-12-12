import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { BookingService } from "src/booking/booking.service";
import { Booking } from "src/booking/enities/booking.entity";
import { SharedBooking } from "src/booking/enities/sharedBooking.entity";
import { TimerReq } from "src/driver/requests/timer.req";
import { BookingCompleteRes } from "src/driver/responses/bookingComplete.res";
export declare class TimersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    private clients;
    private timers;
    server: Server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: any): void;
    joinLoadingRoom(client: Socket, bookingID: string): void;
    leaveLoadingRoom(client: Socket, bookingId: string): void;
    joinUnloadingRoom(client: Socket, bookingId: string): void;
    leaveUnloadingRoom(client: Socket, bookingId: string): void;
    startLoadingTimer(bookingId: string): void;
    stopLoadingTimer(timerReq: TimerReq, bookingId: string): Promise<Booking | SharedBooking>;
    startUnloadingTimer(bookingId: string): void;
    stopUnloadingTimer(timerReq: TimerReq, bookingId: string): Promise<BookingCompleteRes>;
    private formatTime;
}
