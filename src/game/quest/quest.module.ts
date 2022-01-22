import { Module } from '@nestjs/common';
import { QuestScenario } from './quest.scenario';
import { QuestService } from './quest.service';

@Module({
    imports: [],
    providers: [QuestScenario, QuestService],
    exports: [QuestScenario],
})
export class QuestModule {}
