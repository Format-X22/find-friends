import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Quest, QuestDefinition } from './quest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { quests } from './quest.data-index';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class QuestService implements OnModuleInit {
    constructor(@InjectModel(QuestDefinition.name) private questModel: Model<Quest>) {}

    async onModuleInit(): Promise<void> {
        for (const quest of quests) {
            await this.questModel.updateOne({ humanId: quest.humanId }, quest, { upsert: true });
        }
    }

    async getUserQuestNames(): Promise<Array<string>> {
        // TODO -

        return [];
    }

    @Cron(CronExpression.EVERY_HOUR)
    private async matchPlayers(): Promise<void> {
        // TODO -
    }
}
