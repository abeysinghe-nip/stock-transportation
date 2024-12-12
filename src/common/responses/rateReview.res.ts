import { ApiProperty } from "@nestjs/swagger";

export class RateReviewRes {
    @ApiProperty()
    id: string;

    @ApiProperty()
    rate: number;

    @ApiProperty()
    review?: string;
}