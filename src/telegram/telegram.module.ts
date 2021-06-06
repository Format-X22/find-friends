import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import './telegram.decorator';

@Module({
    providers: [TelegramService],
})
export class TelegramModule {}
