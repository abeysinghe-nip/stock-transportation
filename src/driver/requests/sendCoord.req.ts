import { ApiProperty } from "@nestjs/swagger";

export class SendCoordReq {
    @ApiProperty()
    bookingId: string;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    latitude: number;
}