import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';
import { OptionsScenario } from '../options/options.scenario';
import { QuestScenario } from '../quest/quest.scenario';
import { AdminScenario } from '../admin/admin.scenario';
import { InviteScenario } from '../invite/invite.scenario';
import { OnlyFor } from '../../user/user.decorator';

enum ERootButtons {
    QUESTS = 'Задания',
    OPTIONS = 'Настройки',
    NEWS = 'Новости и объявления',
    INVITE = 'Инвайты',
}

enum ERootAdminButtons {
    ADMIN = 'Админ панель',
}

enum EResumeButton {
    RESUME = 'Запустить игру!',
}

const excludeInInactive: Array<string> = [ERootButtons.OPTIONS, ERootButtons.QUESTS];

@TgController()
export class RootScenario {
    @TgStateHandler()
    async root(ctx: TelegramContext): Promise<void> {
        // TODO -
        await ctx.send(
            'Добро пожаловать!' +
                '\n\n' +
                '(описание появится позднее)' +
                '\n\nПишите отзывы и предложения - @oPavlov' +
                '\n\nНу а все новости, объявления и прочее вы можете получать по этой ссылке:' +
                '\n(тоже появится позже)',
            ctx.buttonList(this.makeMainMenuButtons(ctx)),
        );

        await ctx.setState<RootScenario>([RootScenario, 'mainMenuSelect']);

        if (!ctx.user.isActive) {
            await ctx.send('Игра выключена, но ты всегда можешь запустить её!');
        }
    }

    @TgStateHandler()
    async mainMenu(ctx: TelegramContext): Promise<void> {
        await ctx.send('Возвращаю тебя в главный диалог...', ctx.buttonList(this.makeMainMenuButtons(ctx)));
        await ctx.setState<RootScenario>([RootScenario, 'mainMenuSelect']);
    }

    @TgStateHandler()
    async mainMenuSelect(ctx: TelegramContext<ERootButtons & ERootAdminButtons & EResumeButton>): Promise<void> {
        const msg = ctx.message;
        const user = ctx.user;

        if (user.isAdmin) {
            if (msg === ERootAdminButtons.ADMIN) {
                await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
                return;
            }
        }

        if (user.isActive) {
            if (msg === ERootButtons.OPTIONS) {
                await ctx.redirect<OptionsScenario>([OptionsScenario, 'optionsList']);
                return;
            }

            if (msg === ERootButtons.QUESTS) {
                await ctx.redirect<QuestScenario>([QuestScenario, 'questList']);
                return;
            }
        }

        if (!user.isActive) {
            if (msg === EResumeButton.RESUME) {
                await ctx.redirect<RootScenario>([RootScenario, 'resume']);
                return;
            }
        }

        if (msg === ERootButtons.NEWS) {
            await ctx.redirect<RootScenario>([RootScenario, 'showNews']);
            return;
        }

        if (msg === ERootButtons.INVITE) {
            await ctx.redirect<InviteScenario>([InviteScenario, 'mainMenu']);
            return;
        }

        await ctx.send('Похоже такой настройки нет...');
    }

    @TgStateHandler()
    async showNews(ctx: TelegramContext): Promise<void> {
        await ctx.setState<RootScenario>([RootScenario, 'mainMenuSelect']);
        await ctx.send('Все новости и объявления публикуются тут:\n(появится позже)');
    }

    @TgStateHandler()
    @OnlyFor({ isActive: false })
    async resume(ctx: TelegramContext): Promise<void> {
        ctx.user.isActive = true;

        await ctx.send('Игра запущена! 🥳\nВеселье начинается 😉');
        await ctx.user.save();
        await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
    }

    private makeMainMenuButtons(ctx: TelegramContext): Record<string, string> {
        let buttons: Record<string, string> = ERootButtons;

        if (ctx.isAdmin) {
            buttons = { ...ERootButtons, ...ERootAdminButtons };
        }

        if (!ctx.user.isActive) {
            buttons = { ...EResumeButton, ...buttons };
            buttons = Object.fromEntries(
                Object.entries(buttons).filter(([key, value]): boolean => !excludeInInactive.includes(value)),
            );
        }

        return buttons;
    }
}
