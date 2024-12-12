import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SendCoordReq } from "src/driver/requests/sendCoord.req";

@WebSocketGateway({
    cors: {
        origin: "*"
    }
})
export class RideGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

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

    @SubscribeMessage('joinRideRoom')
    joinRideRoom(client: Socket, bookingID: string) {
        client.join(bookingID);
    }

    @SubscribeMessage('leaveRideRoom')
    leaveRideRoom(client: Socket, bookingID: string) {
        client.leave(bookingID);
    }

    sendCoordinates(coordReq: SendCoordReq) {
        this.server.to(coordReq.bookingId).emit('coordinates', { longitude: coordReq.longitude, latitude: coordReq.latitude });
    }
}