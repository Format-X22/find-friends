import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { TelegramContext } from '../telegram/telegram.context';

enum ERootButtons {
    OPTIONS = 'Настройки',
}

@TgController()
export class RootScenario {
    @TgStateHandler()
    async root(ctx: TelegramContext): Promise<void> {
        await ctx.setState('root->mainMenuSelect');
        await ctx.send('Добро пожаловать в тестовую версию бота...', ctx.buttonList(ERootButtons));
    }

    @TgStateHandler('mainMenuSelect')
    async mainMenuSelect(ctx: TelegramContext<ERootButtons>): Promise<void> {
        switch (ctx.message) {
            case ERootButtons.OPTIONS:
                await ctx.redirect('options->optionsList');
                break;

            default:
                await ctx.send('Похоже такой настройки нет...');
        }
    }
}
