import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags("test")
@Controller('test')
export class TestController {
    constructor(private testService: TestService){}

    @UseGuards(AuthGuard)
    @Get()
    @ApiResponse({status: HttpStatus.OK, description: 'Greeting message'})
    getGtreeting(){
        return this.testService.greeting();
    }
}
