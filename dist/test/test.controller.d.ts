import { TestService } from './test.service';
export declare class TestController {
    private testService;
    constructor(testService: TestService);
    getGtreeting(): Promise<string>;
}
