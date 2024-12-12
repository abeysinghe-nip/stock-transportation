import { ApiProperty } from "@nestjs/swagger";

export class FeedbackRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    customerName: string;

    @ApiProperty()
    photoUrl: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    feedback: string;
}