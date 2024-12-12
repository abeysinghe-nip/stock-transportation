import { InjectRepository } from "@nestjs/typeorm";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { NotificationReq } from "src/common/requests/notification.req";
import { Customer } from "src/customer/entities/customer.entity";
import { CustomerNotification } from "src/customer/entities/customerNotification.entity";
import { Driver } from "src/driver/entities/driver.entity";
import { DriverNotification } from "src/driver/entities/driverNotification.entity";
import { Owner } from "src/owner/entities/owner.entity";
import { OwnerNotification } from "src/owner/entities/ownerNotification.entity";
import { Repository } from "typeorm";

@WebSocketGateway({
    cors: {
        origin: "*"
    }
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @InjectRepository(CustomerNotification) private customerNotifyRepo: Repository<CustomerNotification>,
        @InjectRepository(OwnerNotification) private ownerNotifyRepo: Repository<OwnerNotification>,
        @InjectRepository(DriverNotification) private driverNotifyRepo: Repository<DriverNotification>,
        @InjectRepository(Customer) private customerRepo: Repository<Customer>,
        @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
        @InjectRepository(Driver) private driverRepo: Repository<Driver>
    ) { }

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

    @SubscribeMessage('joinCustomerNotifyRoom')
    joinCustomerNotifyRoom(client: Socket, customerId: string) {
        client.join(customerId);
    }

    @SubscribeMessage('leaveCustomerNotifyRoom')
    leaveCustomerNotifyRoom(client: Socket, customerId: string) {
        client.leave(customerId);
    }

    @SubscribeMessage('joinOwnerNotifyRoom')
    joinOwnerNotifyRoom(client: Socket, ownerId: string) {
        client.join(ownerId);
    }

    @SubscribeMessage('leaveOwnerNotifyRoom')
    leaveOwnerNotifyRoom(client: Socket, ownerId: string) {
        client.join(ownerId);
    }

    @SubscribeMessage('joinDriverNotifyRoom')
    joinDriverNotifyRoom(client: Socket, driverId: string) {
        client.join(driverId);
    }

    @SubscribeMessage('leaveDriverNotifyRoom')
    leaveDriverNotifyRoom(client: Socket, driverId: string) {
        client.join(driverId);
    }

    async sendCustomerNotification(request: NotificationReq) {
        this.server.to(request.userId).emit('notification', { request });

        const customer = await this.customerRepo.findOne({
            where: {
                id: request.userId
            }
        });
        const customerNotification: CustomerNotification = new CustomerNotification();
        customerNotification.date = request.timeStamp;
        customerNotification.date = request.timeStamp;
        customerNotification.title = request.title;
        customerNotification.message = request.message;
        customerNotification.customer = customer;
        await this.customerNotifyRepo.save(customerNotification);
        return;
    }

    async sendOwnerNotification(request: NotificationReq) {
        this.server.to(request.userId).emit('notification', { request });

        const owner = await this.ownerRepo.findOne({
            where: {
                id: request.userId
            }
        });
        const ownerNotification: OwnerNotification = new OwnerNotification();
        ownerNotification.date = request.timeStamp;
        ownerNotification.title = request.title;
        ownerNotification.message = request.message;
        ownerNotification.owner = owner;
        await this.ownerNotifyRepo.save(ownerNotification);
        return;
    }

    async sendDriverNotification(request: NotificationReq) {
        this.server.to(request.userId).emit('notification', { request });

        const driver = await this.driverRepo.findOne({
            where: {
                id: request.userId
            }
        });
        const driverNotification: DriverNotification = new DriverNotification;
        driverNotification.date = request.timeStamp;
        driverNotification.title = request.title;
        driverNotification.message = request.message;
        driverNotification.driver = driver;
        await this.driverNotifyRepo.save(driverNotification);
        return;
    }
}