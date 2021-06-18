import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { TelegramContext } from '../telegram/telegram.context';

enum ERootButtons {
    OPTIONS = 'Настройки',
    QUESTS = 'Задания',
    NEWS = 'Новости и объявления',
}

enum ERootAdminButtons {
    ADMIN = 'Админ панель',
}

enum ERootResume {
    RESUME = 'Запустить игру снова!',
}

@TgController('root')
export class RootScenario {
    @TgStateHandler()
    async root(ctx: TelegramContext): Promise<void> {
        if (ctx.user.isActive) {
            let buttonsEnum: typeof ERootButtons = ERootButtons;

            if (ctx.isAdmin) {
                buttonsEnum = { ...ERootButtons, ...ERootAdminButtons };
            }

            await ctx.send(
                'Добро пожаловать в тестовую версию бота...' +
                    '\n\n' +
                    'В этой версии всего три задания - Знакомство наоборот, Научи меня и Рандомный бар.' +
                    '\nВ зависимости от настроек будут попадаться соответствующие задания.' +
                    '\n\nПишите отзывы и предложения - @oPavlov' +
                    '\n\nНу а все новости, объявления и прочее вы можете получать по этой ссылке:' +
                    '\nhttps://t.me/joinchat/Y055xr64tcViMTdi',
                ctx.buttonList(buttonsEnum),
            );

            await ctx.setState('root->mainMenuSelect');
        } else {
            await ctx.send(
                'Игра выключена, но ты всегда можешь запустить её снова' +
                    ' - нажми на кнопку ниже или напиши что угодно сюда в чат - и ты вернешься в игру :)',
                ctx.buttonList(ERootResume),
            );

            await ctx.setState('root->resume');
        }
    }

    @TgStateHandler()
    async mainMenuSelect(ctx: TelegramContext<ERootButtons & ERootAdminButtons>): Promise<void> {
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

            default:
                await ctx.send('Похоже такой настройки нет...');
        }
    }

    @TgStateHandler()
    async showNews(ctx: TelegramContext): Promise<void> {
        await ctx.setState('root->mainMenuSelect');
        await ctx.send('Все новости и объявления публикуются тут:\nhttps://t.me/joinchat/Y055xr64tcViMTdi');
    }

    @TgStateHandler()
    async resume(ctx: TelegramContext): Promise<void> {
        ctx.user.isActive = true;

        await ctx.user.save();
        await ctx.redirect('root->root');
    }
}
