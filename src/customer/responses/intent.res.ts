import { ApiProperty } from "@nestjs/swagger";

export class IntentRes {
    @ApiProperty()
    clientSecret: string;
}