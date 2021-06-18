import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Quest, QuestDefinition } from './quest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { quests } from './quest.data-index';

@Injectable()
export class QuestService implements OnModuleInit {
    constructor(@InjectModel(QuestDefinition.name) private questModel: Model<Quest>) {}

    async onModuleInit(): Promise<void> {
        for (const quest of quests) {
            await this.questModel.updateOne({ humanId: quest.humanId }, quest, { upsert: true });
        }
    }

    async getUserQuestNames(questList: Array<ObjectId | string>): Promise<Array<string>> {
        const result: Array<Quest> = await this.questModel.find({ _id: { $in: questList } });

        console.log(result);

        return [];
    }
}
