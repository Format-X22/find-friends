import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', (): void => {
    let service: UserService;

    beforeEach(async (): Promise<void> => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', (): void => {
        expect(service).toBeDefined();
    });
});
