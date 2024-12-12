import { ApiProperty } from "@nestjs/swagger";

export class TimerReq{
    @ApiProperty({enum : ["original", "shared"]})
    bookingType: string;
}