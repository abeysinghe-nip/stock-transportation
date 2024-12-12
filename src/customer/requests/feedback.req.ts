import { ApiProperty } from "@nestjs/swagger";

export class FeedbackReq{
    @ApiProperty()
    feedback: string;
}