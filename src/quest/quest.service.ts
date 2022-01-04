import { Injectable, OnModuleInit } from '@nestjs/common';
import { quests } from './quest.data-index';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '../user/user.model';

@Injectable()
export class QuestService implements OnModuleInit {
    constructor() {}

    async onModuleInit(): Promise<void> {
        for (const quest of quests) {
            //await this.questModel.updateOne({ humanId: quest.humanId }, quest, { upsert: true });
        }
    }

    async getUserQuestNames(): Promise<Array<string>> {
        // TODO -

        return [];
    }

    @Cron(CronExpression.EVERY_DAY_AT_2PM)
    private async matchPlayers(): Promise<void> {
        //const playerIds: Array<User['_id']> = await this.getActiveUserIds();

        // TODO -
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    private async matchBoringPlayers(): Promise<void> {
        //const playerIds: Array<User['_id']> = await this.getBoringUserIds();

        /*if (playerIds.length % 2 === 1) {
            playerIds.pop();
        }*/

        // TODO -
    }

    private async getActiveUserIds(): Promise<Array<any>> {
        /*return this.userModel
            .find({ isBanned: false, isActive: true }, { _id: true })
            .map((user: User): mongoose.Schema.Types.ObjectId => user._id);*/

        return;
    }

    private async getBoringUserIds(): Promise<Array<any>> {
        /*return this.userModel
            .find({ isBanned: false, isActive: true, isBoring: true }, { _id: true })
            .map((user: User): mongoose.Schema.Types.ObjectId => user._id);*/

        return;
    }
}
