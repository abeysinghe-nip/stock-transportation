import { ApiProperty } from "@nestjs/swagger";

export class BookingCancelDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    reason: string;
}