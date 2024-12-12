import { ApiProperty } from "@nestjs/swagger";

export class SignInResponse{
    @ApiProperty()
    access_token: string;
    @ApiProperty()
    id: string;
}