import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';
import { RootScenario } from '../root/root.scenario';
import { OnlyFor } from '../../user/user.decorator';
import { QuestService } from './quest.service';

enum EBackButton {
    BACK = '(назад)',
}

enum EBoringButton {
    OK = 'Отлично!',
}

enum ENeedMoreButton {
    BLITZ = 'Блиц-задание!',
}

enum ECancelNeedMoreButton {
    CANCEL_NEED_MORE = 'Вычеркните из блиц-задания',
}

@TgController()
export class QuestScenario {
    constructor(private questService: QuestService) {}

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async questList(ctx: TelegramContext): Promise<void> {
        const quests: Array<string> = await this.questService.getQuestsButtons();
        const info =
            'Список заданий, которые вам доступны.' +
            '\nЗначок ➕ означает что задание доступно, но вы его ещё' +
            'не взяли. А значок 🕑 - что уже взяли, но напарников ещё нет.' +
            ' Ну а если у задания уже такой значок - 🌟, значит у вас уже' +
            ' есть напарники и его можно выполнять! Когда напарники появятся -' +
            ' бот сам вам напишет.' +
            '\n\nА ещё можно взять блиц задание - задание для тех кто' +
            ' хочет что-то эдакое здесь и сейчас! Его можно взять' +
            ' даже когда нет других заданий.';

        await ctx.send(info);

        if (!quests.length) {
            await ctx.redirect<QuestScenario>([QuestScenario, 'emptyQuestList']);
            return;
        }

        await ctx.send('А вот и список.', [[...quests, ENeedMoreButton.BLITZ, EBackButton.BACK]]);
        await ctx.setState<QuestScenario>([QuestScenario, 'questSelect']);
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async questSelect(ctx: TelegramContext<ENeedMoreButton.BLITZ | EBackButton.BACK | string>): Promise<void> {
        switch (ctx.message) {
            case EBackButton.BACK:
                await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
                break;

            case ENeedMoreButton.BLITZ:
                await ctx.redirect<QuestScenario>([QuestScenario, 'noQuestsSelect'], ENeedMoreButton.BLITZ);
                break;

            default:
            // TODO -
        }
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async emptyQuestList(ctx: TelegramContext): Promise<void> {
        let message: string = 'Похоже что доступных заданий нет...';
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
                ' Либо дождаться когда бот найдет для тебя новое :)' +
                '\n\nНо если не хочешь ждать - есть блиц-задание!';
            extraButtons = { ...extraButtons, ...ENeedMoreButton };
        }

        extraButtons = { ...extraButtons, ...EBackButton };

        await ctx.send(message, ctx.buttonList(extraButtons));
        await ctx.setState<QuestScenario>([QuestScenario, 'noQuestsSelect']);
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async noQuestsSelect(ctx: TelegramContext<ENeedMoreButton & EBackButton>): Promise<void> {
        switch (ctx.message) {
            case ENeedMoreButton.BLITZ:
                ctx.user.isBoring = true;

                await ctx.user.save();
                await ctx.send(
                    'Хорошо, добавлю тебя в особый список :)' +
                        ' Как только найдется человек, который тоже не хочет ждать' +
                        ' - мы соединим вас вместе!',
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
                await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
                break;

            default:
                await ctx.send('Ой, похоже среди кнопок не было такой, но ничего, сейчас открою главное меню...');
                await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
        }
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async handleBoringResult(ctx: TelegramContext<ENeedMoreButton & EBackButton>): Promise<void> {
        await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
    }
}
