import { ApiProperty } from "@nestjs/swagger";

export class ChatReq {
    @ApiProperty()
    ownerId: string;

    @ApiProperty()
    customerId: string;

    @ApiProperty({enum: ["customer", "owner"]})
    role: string;

    @ApiProperty()
    message: string;
}