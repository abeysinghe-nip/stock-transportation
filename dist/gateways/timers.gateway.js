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
exports.TimersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const booking_service_1 = require("../booking/booking.service");
let TimersGateway = class TimersGateway {
    constructor(bookingService) {
        this.bookingService = bookingService;
        this.clients = new Set();
        this.timers = new Map();
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
    joinLoadingRoom(client, bookingID) {
        client.join(bookingID);
    }
    leaveLoadingRoom(client, bookingId) {
        client.leave(bookingId);
    }
    joinUnloadingRoom(client, bookingId) {
        client.join(bookingId);
    }
    leaveUnloadingRoom(client, bookingId) {
        client.leave(bookingId);
    }
    startLoadingTimer(bookingId) {
        if (this.timers.has(bookingId)) {
            clearInterval(this.timers.get(bookingId).intervalId);
            this.timers.delete(bookingId);
        }
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const loadingTime = this.formatTime(elapsedTime);
            this.server.to(bookingId).emit('timerUpdate', { loadingTime });
        }, 1000);
        this.timers.set(bookingId, { startTime, intervalId });
    }
    async stopLoadingTimer(timerReq, bookingId) {
        if (this.timers.has(bookingId)) {
            const { startTime, intervalId } = this.timers.get(bookingId);
            clearInterval(intervalId);
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            this.timers.delete(bookingId);
            if (timerReq.bookingType === "original") {
                return await this.bookingService.updateBookingLoadingTime(bookingId, elapsedTime);
            }
            else {
                return await this.bookingService.updateSharedBookingLoadingTime(bookingId, elapsedTime);
            }
        }
    }
    startUnloadingTimer(bookingId) {
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
    async stopUnloadingTimer(timerReq, bookingId) {
        if (this.timers.has(bookingId)) {
            const { startTime, intervalId } = this.timers.get(bookingId);
            clearInterval(intervalId);
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            this.timers.delete(bookingId);
            this.server.to(bookingId).emit('timerUpdate', { status: 'stopped' });
            if (timerReq.bookingType === "original") {
                return await this.bookingService.updateBookingUnloadingTime(bookingId, elapsedTime);
            }
            else {
                return await this.bookingService.updateSharedBookingUnloadingTime(bookingId, elapsedTime);
            }
        }
    }
    formatTime(ms) {
        const hours = Math.floor(ms / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((ms % 3600) / 60).toString().padStart(2, '0');
        const seconds = (ms % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
};
exports.TimersGateway = TimersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TimersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinLoadigRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], TimersGateway.prototype, "joinLoadingRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveLoadingRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], TimersGateway.prototype, "leaveLoadingRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinUnloadingRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], TimersGateway.prototype, "joinUnloadingRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveUnloadingRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], TimersGateway.prototype, "leaveUnloadingRoom", null);
exports.TimersGateway = TimersGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*"
        }
    }),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], TimersGateway);
//# sourceMappingURL=timers.gateway.js.map