import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { TelegramContext } from '../telegram/telegram.context';

enum ERootButtons {
    OPTIONS = 'Настройки',
    QUESTS = 'Задания',
    NEWS = 'Новости и объявления',
}

@TgController('root')
export class RootScenario {
    @TgStateHandler()
    async root(ctx: TelegramContext): Promise<void> {
        await ctx.setState('root->mainMenuSelect');
        await ctx.send(
            'Добро пожаловать в тестовую версию бота...' +
                '\n\n' +
                'В этой версии всего три задания - Знакомство наоборот, Научи меня и Рандомный бар.' +
                '\nВ зависимости от настроек будут попадаться соответствующие задания.' +
                '\n\nПишите отзывы и предложения - @oPavlov' +
                '\n\nНу а все новости, объявления и прочее вы можете получать по этой ссылке:' +
                '\nhttps://t.me/joinchat/Y055xr64tcViMTdi',
            ctx.buttonList(ERootButtons),
        );
    }

    @TgStateHandler()
    async mainMenuSelect(ctx: TelegramContext<ERootButtons>): Promise<void> {
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

            default:
                await ctx.send('Похоже такой настройки нет...');
        }
    }

    @TgStateHandler()
    async showNews(ctx: TelegramContext): Promise<void> {
        await ctx.setState('root->mainMenuSelect');
        await ctx.send('Все новости и объявления публикуются тут:\nhttps://t.me/joinchat/Y055xr64tcViMTdi');
    }
}
