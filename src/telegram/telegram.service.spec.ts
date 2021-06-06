import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from './telegram.service';

describe('TelegramService', (): void => {
    let service: TelegramService;

    beforeEach(async (): Promise<void> => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TelegramService],
        }).compile();

        service = module.get<TelegramService>(TelegramService);
    });

    it('should be defined', (): void => {
        expect(service).toBeDefined();
    });
});
