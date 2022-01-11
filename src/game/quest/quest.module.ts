import { Module } from '@nestjs/common';
import { QuestScenario } from './quest.scenario';
import { QuestModule as QuestModuleLegacy } from '../../quest/quest.module';

@Module({
    imports: [QuestModuleLegacy],
    providers: [QuestScenario],
    exports: [QuestScenario],
})
export class QuestModule {}
