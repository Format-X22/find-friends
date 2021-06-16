import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestDefinition, QuestSchema } from './quest.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: QuestDefinition.name, schema: QuestSchema }])],
    providers: [QuestService],
    exports: [QuestService],
})
export class QuestModule {}
