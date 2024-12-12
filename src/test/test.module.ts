import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [],
    providers: [TestService],
    controllers: [TestController],
    exports: []
})
export class TestModule {}
