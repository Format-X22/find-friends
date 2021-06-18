import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { TelegramContext } from '../telegram/telegram.context';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDefinition } from '../user/user.schema';
import { Model, UpdateQuery } from 'mongoose';

enum EAdminOptions {
    DEACTIVATE = 'Деактивировать',
    REACTIVATE = 'Снова активировать',
    SET_BUN = 'Забанить',
    REMOVE_BUN = 'Разбанить',
    BACK = '(назад)',
}

@TgController('admin')
export class AdminScenario {
    constructor(@InjectModel(UserDefinition.name) private userModel: Model<User>) {}

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

            case EAdminOptions.SET_BUN:
                await ctx.send('Введите ник');
                await ctx.setState('admin->setBunUserInput');
                break;

            case EAdminOptions.REMOVE_BUN:
                await ctx.send('Введите ник');
                await ctx.setState('admin->removeBunUserInput');
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
        const ok: boolean = await this.updateUser(ctx, { $set: { isActive: false, state: 'root->root' } });

        if (!ok) {
            return;
        }

        await ctx.send('Пользователь деактивирован');
        await ctx.redirect('admin->mainMenu');
    }

    @TgStateHandler()
    async reactivateUserInput(ctx: TelegramContext): Promise<void> {
        const ok: boolean = await this.updateUser(ctx, { $set: { isActive: true, state: 'root->root' } });

        if (!ok) {
            return;
        }

        await ctx.send('Пользователь снова активирован');
        await ctx.redirect('admin->mainMenu');
    }

    @TgStateHandler()
    async setBunUserInput(ctx: TelegramContext): Promise<void> {
        const ok: boolean = await this.updateUser(ctx, { $set: { isBanned: true, state: 'root->root' } });

        if (!ok) {
            return;
        }

        await ctx.send('Пользователь забанен');
        await ctx.redirect('admin->mainMenu');
    }

    @TgStateHandler()
    async removeBunUserInput(ctx: TelegramContext): Promise<void> {
        const ok: boolean = await this.updateUser(ctx, { $set: { isBanned: false, state: 'root->root' } });

        if (!ok) {
            return;
        }

        await ctx.send('Пользователь разбанен');
        await ctx.redirect('admin->mainMenu');
    }

    private async updateUser(ctx: TelegramContext, update: UpdateQuery<User>): Promise<boolean> {
        let username: string = ctx.message.trim();

        if (username[0] === '@') {
            username = username.slice(1, username.length);
        }

        const user: User = await this.userModel.findOne({ username });

        if (!user) {
            await ctx.send('Пользователь НЕ НАЙДЕН');
            await ctx.redirect('admin->mainMenu');
            return false;
        }

        await this.userModel.updateOne({ username }, update);

        return true;
    }
}
