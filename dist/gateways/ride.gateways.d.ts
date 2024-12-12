import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SendCoordReq } from "src/driver/requests/sendCoord.req";
export declare class RideGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private clients;
    server: Server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: any): void;
    joinRideRoom(client: Socket, bookingID: string): void;
    leaveRideRoom(client: Socket, bookingID: string): void;
    sendCoordinates(coordReq: SendCoordReq): void;
}
