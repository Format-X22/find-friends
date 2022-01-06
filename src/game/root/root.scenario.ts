import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';

enum ERootButtons {
    QUESTS = 'Задания',
    OPTIONS = 'Настройки',
    NEWS = 'Новости и объявления',
    INVITE = 'Инвайты',
    EDITOR = 'Для творцов',
}

enum ERootAdminButtons {
    ADMIN = 'Админ панель',
}

enum EResumeButton {
    RESUME = 'Запустить игру!',
}

const excludeInInactive: Array<string> = [ERootButtons.OPTIONS, ERootButtons.QUESTS];

@TgController('root')
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

        await ctx.setState('root->mainMenuSelect');

        if (!ctx.user.isActive) {
            await ctx.send('Игра выключена, но ты всегда можешь запустить её!');
        }
    }

    @TgStateHandler()
    async mainMenu(ctx: TelegramContext): Promise<void> {
        await ctx.send('Возвращаю тебя в главный диалог...', ctx.buttonList(this.makeMainMenuButtons(ctx)));
        await ctx.setState('root->mainMenuSelect');
    }

    @TgStateHandler()
    async mainMenuSelect(ctx: TelegramContext<ERootButtons & ERootAdminButtons & EResumeButton>): Promise<void> {
        switch (ctx.message) {
            case ERootButtons.OPTIONS:
                await ctx.redirect('options->optionsList');
                break;

            case ERootButtons.QUESTS:
                await ctx.redirect('quest->questList');
                break;

            case ERootButtons.NEWS:
                await ctx.redirect('root->showNews');
                break;

            case ERootAdminButtons.ADMIN:
                await ctx.redirect('admin->mainMenu');
                break;

            case EResumeButton.RESUME:
                await ctx.redirect('root->resume');
                break;

            case ERootButtons.INVITE:
                await ctx.redirect('invite->mainMenu');
                break;

            default:
                await ctx.send('Похоже такой настройки нет...');
        }
    }

    @TgStateHandler()
    async showNews(ctx: TelegramContext): Promise<void> {
        await ctx.setState('root->mainMenuSelect');
        await ctx.send('Все новости и объявления публикуются тут:\n(появится позже)');
    }

    @TgStateHandler()
    async resume(ctx: TelegramContext): Promise<void> {
        ctx.user.isActive = true;

        await ctx.user.save();
        await ctx.redirect('root->root');
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
