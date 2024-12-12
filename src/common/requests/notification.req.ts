import { ApiProperty } from "@nestjs/swagger";

export class NotificationReq{
    @ApiProperty()
    id: string;

    @ApiProperty()
    timeStamp: Date;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;
}