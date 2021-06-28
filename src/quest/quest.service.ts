import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Quest, QuestDefinition } from './quest.schema';
import { InjectModel } from '@nestjs/mongoose';
import { quests } from './quest.data-index';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User, UserDefinition } from '../user/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class QuestService implements OnModuleInit {
    constructor(
        @InjectModel(QuestDefinition.name) private questModel: Model<Quest>,
        @InjectModel(UserDefinition.name) private userModel: Model<User>,
    ) {}

    async onModuleInit(): Promise<void> {
        for (const quest of quests) {
            await this.questModel.updateOne({ humanId: quest.humanId }, quest, { upsert: true });
        }
    }

    async getUserQuestNames(): Promise<Array<string>> {
        // TODO -

        return [];
    }

    @Cron(CronExpression.EVERY_DAY_AT_2PM)
    private async matchPlayers(): Promise<void> {
        const playerIds: Array<User['_id']> = await this.getActiveUserIds();

        // TODO -
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    private async matchBoringPlayers(): Promise<void> {
        const playerIds: Array<User['_id']> = await this.getBoringUserIds();

        if (playerIds.length % 2 === 1) {
            playerIds.pop();
        }

        // TODO -
    }

    private async getActiveUserIds(): Promise<Array<User['_id']>> {
        return this.userModel
            .find({ isBanned: false, isActive: true }, { _id: true })
            .map((user: User): mongoose.Schema.Types.ObjectId => user._id);
    }

    private async getBoringUserIds(): Promise<Array<User['_id']>> {
        return this.userModel
            .find({ isBanned: false, isActive: true, isBoring: true }, { _id: true })
            .map((user: User): mongoose.Schema.Types.ObjectId => user._id);
    }
}
