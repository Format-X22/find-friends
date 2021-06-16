import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Quest, QuestDefinition } from './quest.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class QuestService {
    constructor(@InjectModel(QuestDefinition.name) private questModel: Model<Quest>) {}

    async getUserQuestNames(quests: Array<ObjectId | string>): Promise<Array<string>> {
        const result: Array<Quest> = await this.questModel.find({ _id: { $in: quests } });

        console.log(result);

        return [];
    }
}
