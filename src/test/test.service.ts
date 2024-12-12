import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
    private message: string = "Hello from stock transportation!"

    async greeting(){
        return this.message;
    }
}
