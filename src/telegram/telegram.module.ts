import { Global, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import './telegram.decorator';
import { GameModule } from '../game/game.module';

@Global()
@Module({
    imports: [GameModule],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule {}
