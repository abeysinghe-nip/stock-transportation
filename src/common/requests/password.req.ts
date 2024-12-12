import { ApiProperty } from "@nestjs/swagger";

export class Password{
    @ApiProperty()
    password: string;
}