import { Module } from '@nestjs/common';
import { QuestScenario } from './quest.scenario';

@Module({
    providers: [QuestScenario],
    exports: [QuestScenario],
})
export class QuestModule {}
