import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';
import { QuestService } from '../../quest/quest.service';
import { RootScenario } from '../root/root.scenario';
import { OnlyFor } from '../../user/user.decorator';

enum EBackButton {
    BACK = '(назад)',
}

enum EBoringButton {
    OK = 'Отлично!',
}

enum ENeedMoreButton {
    NEED_MORE = 'Не хочу ждать!',
}

enum ECancelNeedMoreButton {
    CANCEL_NEED_MORE = 'Вычеркните, подожду',
}

@TgController()
export class QuestScenario {
    constructor(private questService: QuestService) {}

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async questList(ctx: TelegramContext): Promise<void> {
        const questNames: Array<string> = await this.questService.getUserQuestNames();
        let message: string = 'Похоже что доступных заданий нет...';

        if (!questNames.length) {
            let extraButtons: Record<string, string> = {};

            if (ctx.user.isBoring) {
                message +=
                    '\n\nМы добавили тебя в список скучающих и уже ищем тебе напарника' +
                    ' на задание. Но можешь вычеркнуть себя из списка, если нужно.';
                extraButtons = { ...extraButtons, ...ECancelNeedMoreButton };
            } else {
                message +=
                    '\n\nМожешь попробовать поменять настройки интенсивности,' +
                    ' если хочется получать заданий побольше.' +
                    ' Либо дождаться когда бот найдет для тебя новое :)';
                extraButtons = { ...extraButtons, ...ENeedMoreButton };
            }

            extraButtons = { ...extraButtons, ...EBackButton };

            await ctx.send(message, ctx.buttonList(extraButtons));
            await ctx.setState<QuestScenario>([QuestScenario, 'noQuestsSelect']);
            return;
        }

        // TODO -
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async noQuestsSelect(ctx: TelegramContext<ENeedMoreButton & EBackButton>): Promise<void> {
        switch (ctx.message) {
            case ENeedMoreButton.NEED_MORE:
                ctx.user.isBoring = true;

                await ctx.user.save();
                await ctx.send(
                    'Хорошо, добавлю тебя в особый список :)' +
                        ' Как только найдется человек, который тоже не хочет ждать - мы соединим вас вместе!',
                    ctx.buttonList(EBoringButton),
                );
                await ctx.setState<QuestScenario>([QuestScenario, 'handleBoringResult']);

                break;

            case ECancelNeedMoreButton.CANCEL_NEED_MORE:
                ctx.user.isBoring = false;

                await ctx.user.save();
                await ctx.send('Хорошо, вычеркиваю!', ctx.buttonList(EBoringButton));
                await ctx.setState<QuestScenario>([QuestScenario, 'handleBoringResult']);
                break;

            case EBackButton.BACK:
                await ctx.redirect<RootScenario>([RootScenario, 'root']);
                break;

            default:
                await ctx.send('Ой, похоже среди кнопок не было такой, но ничего, сейчас открою главное меню...');
                await ctx.redirect<RootScenario>([RootScenario, 'root']);
        }
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async handleBoringResult(ctx: TelegramContext<ENeedMoreButton & EBackButton>): Promise<void> {
        await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
    }
}
