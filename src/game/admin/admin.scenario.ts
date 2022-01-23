import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';
import { User } from '../../models/definition/user.model';
import { TelegramService } from '../../telegram/telegram.service';
import { RootScenario } from '../root/root.scenario';
import { LazyModuleLoader } from '@nestjs/core';
import { OnModuleInit } from '@nestjs/common';
import { TelegramModule } from '../../telegram/telegram.module';
import { ModelsService } from '../../models/models.service';
import { OnlyFor } from '../../user/user.decorator';

enum EAdminOptions {
    DEACTIVATE = 'Деактивировать',
    REACTIVATE = 'Снова активировать',
    SET_BAN = 'Забанить',
    REMOVE_BAN = 'Разбанить',
    DIRECT_SEND = 'Написать пользователю',
    MASS_SEND = 'Массовая рассылка',
    RESET_STATE = 'Сбросить стейт',
    QUEST_FOR_MODERATION_LIST = 'Список заданий на модерацию',
    REJECT_QUEST_REQUEST = 'Отменить задание на модерации',
    APPROVE_QUEST_REQUEST = 'Принять задание на модерации',
    BACK = '(назад)',
}

enum ECancelButton {
    CANCEL = '(отменить)',
}

@TgController()
export class AdminScenario implements OnModuleInit {
    private readonly userModel: typeof User;
    private telegramService: TelegramService;

    constructor(private modelsService: ModelsService, private lazyModuleLoader: LazyModuleLoader) {
        this.userModel = this.modelsService.userModel;
    }

    async onModuleInit(): Promise<void> {
        const telegramRef = await this.lazyModuleLoader.load(() => TelegramModule);

        this.telegramService = telegramRef.get(TelegramService);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async mainMenu(ctx: TelegramContext): Promise<void> {
        await ctx.send('Выберите меню...', ctx.buttonList(EAdminOptions));
        await ctx.setState<AdminScenario>([AdminScenario, 'mainMenuSelect']);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async mainMenuSelect(ctx: TelegramContext<EAdminOptions>): Promise<void> {
        switch (ctx.message) {
            case EAdminOptions.DEACTIVATE:
                await ctx.send('Введите ник');
                await ctx.setState<AdminScenario>([AdminScenario, 'deactivateUserInput']);
                break;

            case EAdminOptions.REACTIVATE:
                await ctx.send('Введите ник');
                await ctx.setState<AdminScenario>([AdminScenario, 'reactivateUserInput']);
                break;

            case EAdminOptions.SET_BAN:
                await ctx.send('Введите ник и причину через пробел');
                await ctx.setState<AdminScenario>([AdminScenario, 'setBanUserInput']);
                break;

            case EAdminOptions.REMOVE_BAN:
                await ctx.send('Введите ник');
                await ctx.setState<AdminScenario>([AdminScenario, 'removeBanUserInput']);
                break;

            case EAdminOptions.DIRECT_SEND:
                await ctx.send('Введите ник и сообщение через пробел');
                await ctx.setState<AdminScenario>([AdminScenario, 'directSendInput']);
                break;

            case EAdminOptions.MASS_SEND:
                await ctx.send('Введите сообщение', ctx.buttonList(ECancelButton));
                await ctx.setState<AdminScenario>([AdminScenario, 'massSendInput']);
                break;

            case EAdminOptions.RESET_STATE:
                await ctx.send('Введите ник');
                await ctx.setState<AdminScenario>([AdminScenario, 'resetUserInput']);
                break;

            case EAdminOptions.QUEST_FOR_MODERATION_LIST:
                await ctx.redirect<AdminScenario>([AdminScenario, 'getQuestForModerationList']);
                break;

            case EAdminOptions.REJECT_QUEST_REQUEST:
                await ctx.send('Введите id запроса и причину через пробел');
                await ctx.setState<AdminScenario>([AdminScenario, 'rejectQuestRequest']);
                break;

            case EAdminOptions.APPROVE_QUEST_REQUEST:
                await ctx.send('Введите id запроса');
                await ctx.setState<AdminScenario>([AdminScenario, 'approveQuestRequest']);
                break;

            case EAdminOptions.BACK:
                await ctx.redirect<RootScenario>([RootScenario, 'root']);
                break;

            default:
                await ctx.send('Такой опции нет...');
                await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
        }
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async deactivateUserInput(ctx: TelegramContext): Promise<void> {
        const user = await this.updateUser(ctx, { isActive: false, state: 'root->root' });

        if (!user) {
            return;
        }

        await ctx.send('Пользователь деактивирован');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
        await ctx.sendFor(
            user,
            'Ваш аккаунт деактивирован администратором в ручную, ' +
                'это значит что игра для вас приостановлена,' +
                ' но остальные функции остались включены.',
        );
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async reactivateUserInput(ctx: TelegramContext): Promise<void> {
        const user = await this.updateUser(ctx, { isActive: true, state: 'root->root' });

        if (!user) {
            return;
        }

        await ctx.send('Пользователь снова активирован');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
        await ctx.sendFor(user, 'Ваш аккаунт активирован администратором в ручную, игра для вас запущена!');
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async setBanUserInput(ctx: TelegramContext): Promise<void> {
        const [username, banReason] = this.splitUsernameAndMessage(ctx);

        ctx.message = username;

        const user = await this.updateUser(ctx, { isBanned: true, banReason, state: 'root->root' });

        if (!user) {
            return;
        }

        await ctx.send('Пользователь забанен');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
        await ctx.sendFor(user, 'Вы забанены! Причина: ' + banReason);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async removeBanUserInput(ctx: TelegramContext): Promise<void> {
        const user = await this.updateUser(ctx, { isBanned: false, state: 'root->root' });

        if (!user) {
            return;
        }

        await ctx.send('Пользователь разбанен');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
        await ctx.sendFor(user, 'Вы разбанены!');
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async directSendInput(ctx: TelegramContext): Promise<void> {
        const [username, message] = this.splitUsernameAndMessage(ctx);
        const user: User = await this.userModel.findOne({ where: { username } });

        if (user) {
            await ctx.sendFor(user, message);
            await ctx.send('Отправлено!');
        } else {
            await ctx.send('Пользователь НЕ НАЙДЕН');
        }

        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async massSendInput(ctx: TelegramContext<ECancelButton | string>): Promise<void> {
        if (ctx.message === ECancelButton.CANCEL) {
            await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
            return;
        }

        await ctx.send('Отправляю...');

        const users: Array<User> = await this.userModel.findAll({ where: { isActive: true, isBanned: false } });

        for (const user of users) {
            await this.telegramService.sendText(user, ctx.message);
        }

        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async resetUserInput(ctx: TelegramContext): Promise<void> {
        let username: string = this.normalizeUsername(ctx.message);
        const user: User = await this.userModel.findOne({ where: { username } });

        if (user) {
            await ctx.sendFor(user, 'Ваш диалог с ботом сброшен до главного меню!');
            await ctx.redirectFor<RootScenario>(user, [RootScenario, 'mainMenu']);
            await ctx.send('Успешно!');
            await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
        } else {
            await ctx.send('Пользователь НЕ НАЙДЕН');
        }
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async getQuestForModerationList(ctx: TelegramContext): Promise<void> {
        const requests = await this.modelsService.questRequest.findAll({
            where: {
                isModerated: false,
            },
            include: [User],
        });

        const message = requests
            .map((request) => `${request.id} - @${request.user.username} - ${request.url}`)
            .join('\n');

        await ctx.send(message);
        await ctx.setState<AdminScenario>([AdminScenario, 'mainMenuSelect']);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async rejectQuestRequest(ctx: TelegramContext<ECancelButton | string>): Promise<void> {
        if (ctx.message === ECancelButton.CANCEL) {
            await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
            return;
        }

        const messageSplit = ctx.message.trim().split(' ');
        const id = Number(messageSplit[0]);
        const reason = messageSplit.slice(1, messageSplit.length).join(' ');

        if (!id || !reason) {
            await ctx.send('Не валидные параметры');
            return;
        }

        const request = await this.modelsService.questRequest.findOne({
            where: { id, isModerated: false },
            include: [User],
        });

        if (!request) {
            await ctx.send('Не найдено');
            return;
        }

        request.isModerated = true;
        request.cancelReason = reason;

        await request.save();
        await ctx.send('Успешно!');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
        await ctx.sendFor(
            request.user,
            `Ваше задание ${request.url} отклонено по причине "${reason}".` +
                ' Но не переживайте - чуть-чуть доработать и можно отправить ещё раз :)',
        );
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    async approveQuestRequest(ctx: TelegramContext<ECancelButton | string>): Promise<void> {
        if (ctx.message === ECancelButton.CANCEL) {
            await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
            return;
        }

        const id = Number(ctx.message.trim());

        if (!id) {
            await ctx.send('Не валидные параметры');
            return;
        }

        const request = await this.modelsService.questRequest.findOne({
            where: { id, isModerated: false },
            include: [User],
        });

        if (!request) {
            await ctx.send('Не найдено');
            return;
        }

        request.isModerated = true;
        request.isApproved = true;

        await request.save();
        await ctx.send('Успешно!');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
        await ctx.sendFor(
            request.user,
            `Ваше задание ${request.url} принято! 🥳 \nСкоро оно появится среди заданий для игроков.`,
        );
    }

    private async updateUser(ctx: TelegramContext, update: Partial<User>): Promise<User | false> {
        let username: string = this.normalizeUsername(ctx.message);
        const user: User = await this.userModel.findOne({ where: { username } });

        if (!user) {
            await ctx.send('Пользователь НЕ НАЙДЕН');
            await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
            return false;
        }

        await user.update(update);

        return user;
    }

    private splitUsernameAndMessage(ctx: TelegramContext): [string, string] {
        const messageSplit = ctx.message.trim().split(' ');

        return [messageSplit[0], messageSplit.slice(1, messageSplit.length).join(' ')];
    }

    private normalizeUsername(raw: string): string {
        let username: string = raw.trim();

        if (username[0] === '@') {
            username = username.slice(1, username.length);
        }

        if (username.startsWith('http')) {
            const usernameSplit = username.split('/');

            username = usernameSplit[usernameSplit.length - 1];
        }

        return username;
    }
}
