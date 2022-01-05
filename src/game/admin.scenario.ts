import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { TelegramContext } from '../telegram/telegram.context';
import { User } from '../user/user.model';
import { TelegramService } from '../telegram/telegram.service';
import { InjectModel } from '@nestjs/sequelize';

enum EAdminOptions {
    DEACTIVATE = 'Деактивировать',
    REACTIVATE = 'Снова активировать',
    SET_BAN = 'Забанить',
    REMOVE_BAN = 'Разбанить',
    MASS_SEND = 'Массовая рассылка',
    BACK = '(назад)',
}

enum ECancelButton {
    CANCEL = '(отменить)',
}

@TgController('admin')
export class AdminScenario {
    constructor(@InjectModel(User) private userModel: typeof User, private telegramService: TelegramService) {}

    @TgStateHandler()
    async mainMenu(ctx: TelegramContext): Promise<void> {
        await ctx.send('Выберите меню...', ctx.buttonList(EAdminOptions));
        await ctx.setState('admin->mainMenuSelect');
    }

    @TgStateHandler()
    async mainMenuSelect(ctx: TelegramContext<EAdminOptions>): Promise<void> {
        switch (ctx.message) {
            case EAdminOptions.DEACTIVATE:
                await ctx.send('Введите ник');
                await ctx.setState('admin->deactivateUserInput');
                break;

            case EAdminOptions.REACTIVATE:
                await ctx.send('Введите ник');
                await ctx.setState('admin->reactivateUserInput');
                break;

            case EAdminOptions.SET_BAN:
                await ctx.send('Введите ник');
                await ctx.setState('admin->setBanUserInput');
                break;

            case EAdminOptions.REMOVE_BAN:
                await ctx.send('Введите ник');
                await ctx.setState('admin->removeBanUserInput');
                break;

            case EAdminOptions.MASS_SEND:
                await ctx.send('Введите сообщение', ctx.buttonList(ECancelButton));
                await ctx.setState('admin->massSendInput');
                break;

            case EAdminOptions.BACK:
                await ctx.redirect('root->root');
                break;

            default:
                await ctx.send('Такой опции нет...');
                await ctx.redirect('admin->mainMenu');
        }
    }

    @TgStateHandler()
    async deactivateUserInput(ctx: TelegramContext): Promise<void> {
        const ok: boolean = await this.updateUser(ctx, { isActive: false, state: 'root->root' });

        if (!ok) {
            return;
        }

        await ctx.send('Пользователь деактивирован');
        await ctx.redirect('admin->mainMenu');
    }

    @TgStateHandler()
    async reactivateUserInput(ctx: TelegramContext): Promise<void> {
        const ok: boolean = await this.updateUser(ctx, { isActive: true, state: 'root->root' });

        if (!ok) {
            return;
        }

        await ctx.send('Пользователь снова активирован');
        await ctx.redirect('admin->mainMenu');
    }

    @TgStateHandler()
    async setBanUserInput(ctx: TelegramContext): Promise<void> {
        const ok: boolean = await this.updateUser(ctx, { isBanned: true, state: 'root->root' });

        if (!ok) {
            return;
        }

        await ctx.send('Пользователь забанен');
        await ctx.redirect('admin->mainMenu');
    }

    @TgStateHandler()
    async removeBanUserInput(ctx: TelegramContext): Promise<void> {
        const ok: boolean = await this.updateUser(ctx, { isBanned: false, state: 'root->root' });

        if (!ok) {
            return;
        }

        await ctx.send('Пользователь разбанен');
        await ctx.redirect('admin->mainMenu');
    }

    @TgStateHandler()
    async massSendInput(ctx: TelegramContext<ECancelButton | string>): Promise<void> {
        if (ctx.message === ECancelButton.CANCEL) {
            await ctx.redirect('admin->mainMenu');
            return;
        }

        await ctx.send('Отправляю...');

        const users: Array<User> = await this.userModel.findAll({ where: { isActive: true, isBanned: false } });

        for (const user of users) {
            await this.telegramService.sendText(user, ctx.message);
        }

        await ctx.redirect('admin->mainMenu');
    }

    private async updateUser(ctx: TelegramContext, update: Partial<User>): Promise<boolean> {
        let username: string = ctx.message.trim();

        if (username[0] === '@') {
            username = username.slice(1, username.length);
        }

        const user: User = await this.userModel.findOne({ where: { username } });

        if (!user) {
            await ctx.send('Пользователь НЕ НАЙДЕН');
            await ctx.redirect('admin->mainMenu');
            return false;
        }

        await user.update(update);

        return true;
    }
}
