import { Global, Module } from '@nestjs/common';
import { RootScenario } from './root.scenario';
import { PayScenario } from './pay.scenario';
import { QuestScenario } from './quest.scenario';
import { OptionsScenario } from './options.scenario';
import { QuestModule } from '../quest/quest.module';

@Global()
@Module({
    imports: [QuestModule],
    providers: [RootScenario, PayScenario, QuestScenario, OptionsScenario],
    exports: [RootScenario, PayScenario, QuestScenario, OptionsScenario],
})
export class GameModule {}
