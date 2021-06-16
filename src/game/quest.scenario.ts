import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { TelegramContext } from '../telegram/telegram.context';
import { QuestService } from '../quest/quest.service';

@TgController('quest')
export class QuestScenario {
    constructor(private questService: QuestService) {}

    @TgStateHandler()
    async questList(ctx: TelegramContext): Promise<void> {
        const names: Array<string> = await this.questService.getUserQuestNames(ctx.user.quests);
        // TODO -
        await ctx.redirect('root->root');
    }
}
