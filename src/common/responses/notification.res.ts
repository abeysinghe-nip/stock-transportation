import { ApiProperty } from "@nestjs/swagger";

export class NotificationRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    timeStamp: Date;

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;
}