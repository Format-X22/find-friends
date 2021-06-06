import { Global, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import './telegram.decorator';
import { RootScenario } from '../game/root.scenario';
import { PayScenario } from '../game/pay.scenario';
import { QuestScenario } from '../game/quest.scenario';
import { OptionsScenario } from '../game/options.scenario';

@Global()
@Module({
    imports: [],
    providers: [TelegramService, RootScenario, PayScenario, QuestScenario, OptionsScenario],
    exports: [TelegramService],
})
export class TelegramModule {}
