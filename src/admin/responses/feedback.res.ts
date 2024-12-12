import { ApiProperty } from "@nestjs/swagger";

export class FeedbackRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    customerName: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    isApproved: boolean;

    @ApiProperty()
    feedback: string;
}