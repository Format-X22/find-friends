import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { TelegramContext } from '../telegram/telegram.context';
import { QuestService } from '../quest/quest.service';

enum EBackButton {
    BACK = '(назад)',
}

enum EBoringButton {
    OK = 'Отлично!',
}

enum ENoQuestsButtons {
    NEED_MORE = 'Не хочу ждать!',
}

@TgController('quest')
export class QuestScenario {
    constructor(private questService: QuestService) {}

    @TgStateHandler()
    async questList(ctx: TelegramContext): Promise<void> {
        const questNames: Array<string> = await this.questService.getUserQuestNames();

        if (!questNames.length) {
            await ctx.send(
                'Похоже что доступных заданий нет...' +
                    '\n\nМожешь попробовать поменять настройки интенсивности,' +
                    ' если хочется получать заданий побольше.' +
                    ' Либо дождаться когда бот найдет для тебя новое :)',
                ctx.buttonList({ ...ENoQuestsButtons, ...EBackButton }),
            );
            await ctx.setState('quest->noQuestsSelect');
        }

        // TODO -
    }

    @TgStateHandler()
    async noQuestsSelect(ctx: TelegramContext<ENoQuestsButtons & EBackButton>): Promise<void> {
        switch (ctx.message) {
            case ENoQuestsButtons.NEED_MORE:
                ctx.user.isBoring = true;

                await ctx.user.save();
                await ctx.send(
                    'Хорошо, мы добавили тебя в особый список :)' +
                        ' Как только найдется человек, который тоже не хочет ждать - мы соединим вас вместе!',
                    ctx.buttonList(EBoringButton),
                );
                await ctx.setState('quest->handleBoringResult');

                break;

            case EBackButton.BACK:
                await ctx.redirect('root->root');
                break;

            default:
                await ctx.send('Ой, похоже среди кнопок не было такой, но ничего, сейчас открою главное меню...');
                await ctx.redirect('root->root');
        }
    }

    @TgStateHandler()
    async handleBoringResult(ctx: TelegramContext<ENoQuestsButtons & EBackButton>): Promise<void> {
        await ctx.redirect('root->mainMenu');
    }
}
