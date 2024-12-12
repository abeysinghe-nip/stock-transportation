import { ApiProperty } from "@nestjs/swagger";

export class AssignDriverReq{
    @ApiProperty()
    driverId: string;

    @ApiProperty()
    vehicleId: string;

    @ApiProperty()
    ownerId: string;
}