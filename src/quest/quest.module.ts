import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestDefinition, QuestSchema } from './quest.schema';
import { UserDefinition, UserSchema } from '../user/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: QuestDefinition.name, schema: QuestSchema }]),
        MongooseModule.forFeature([{ name: UserDefinition.name, schema: UserSchema }]),
    ],
    providers: [QuestService],
    exports: [QuestService],
})
export class QuestModule {}
