import { ApiProperty } from "@nestjs/swagger";

export class SignInDto{
    @ApiProperty()
    userName: string;

    @ApiProperty()
    password: string;
}