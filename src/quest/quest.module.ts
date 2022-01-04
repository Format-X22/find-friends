import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';

@Module({
    imports: [],
    providers: [QuestService],
    exports: [QuestService],
})
export class QuestModule {}
