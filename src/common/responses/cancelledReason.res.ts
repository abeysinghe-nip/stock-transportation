import { ApiProperty } from "@nestjs/swagger";

export class CancelledReasonRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    reason: string;
}