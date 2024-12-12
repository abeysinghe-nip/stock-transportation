"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let RideGateway = class RideGateway {
    constructor() {
        this.clients = new Set();
    }
    afterInit(server) {
        console.log("Timer gateway initialized");
    }
    handleConnection(client) {
        console.log('Client connected: ', client.id);
        this.clients.add(client);
    }
    handleDisconnect(client) {
        console.log("Client disconnected: ", client.id);
        this.clients.delete(client);
    }
    joinRideRoom(client, bookingID) {
        client.join(bookingID);
    }
    leaveRideRoom(client, bookingID) {
        client.leave(bookingID);
    }
    sendCoordinates(coordReq) {
        this.server.to(coordReq.bookingId).emit('coordinates', { longitude: coordReq.longitude, latitude: coordReq.latitude });
    }
};
exports.RideGateway = RideGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RideGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRideRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], RideGateway.prototype, "joinRideRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRideRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], RideGateway.prototype, "leaveRideRoom", null);
exports.RideGateway = RideGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*"
        }
    })
], RideGateway);
//# sourceMappingURL=ride.gateways.js.map