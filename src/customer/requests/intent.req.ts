import { ApiProperty } from "@nestjs/swagger";

export class IntentReq {
    @ApiProperty()
    amount: number;
}