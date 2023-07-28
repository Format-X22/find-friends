import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';
import { ECharacterOptions, User } from '../../models/definition/user.model';
import { TelegramService } from '../../telegram/telegram.service';
import { RootScenario } from '../root/root.scenario';
import { LazyModuleLoader } from '@nestjs/core';
import { OnApplicationBootstrap } from '@nestjs/common';
import { TelegramModule } from '../../telegram/telegram.module';
import { ModelsService } from '../../models/models.service';
import { OnlyFor } from '../../user/user.decorator';
import { Quest } from '../../models/definition/quest.model';
import { BackIfCancel } from './admin.decorator';

enum EAdminOptions {
    DEACTIVATE = 'Деактивировать пользователя',
    REACTIVATE = 'Снова активировать пользователя',
    SET_BAN = 'Забанить пользователя',
    REMOVE_BAN = 'Разбанить пользователя',
    DIRECT_SEND = 'Написать пользователю',
    MASS_SEND = 'Массовая рассылка',
    RESET_STATE = 'Сбросить стейт пользователя',
    QUEST_LIST = 'Список квестов',
    ADD_QUEST = 'Добавить квест',
    DEACTIVATE_QUEST = 'Деактивировать квест',
    ACTIVATE_QUEST = 'Активировать квест',
    BACK = '(назад)',
}

export enum ECancelButton {
    CANCEL = '(отменить)',
}

@TgController()
export class AdminScenario implements OnApplicationBootstrap {
    private readonly userModel: typeof User;
    private readonly questModel: typeof Quest;
    private telegramService: TelegramService;

    constructor(
        private modelsService: ModelsService,
        private lazyModuleLoader: LazyModuleLoader,
    ) {
        this.userModel = this.modelsService.userModel;
        this.questModel = this.modelsService.questModel;
    }

    async onApplicationBootstrap(): Promise<void> {
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

            case EAdminOptions.QUEST_LIST:
                await ctx.redirect<AdminScenario>([AdminScenario, 'getQuestList']);
                break;

            case EAdminOptions.ADD_QUEST:
                await ctx.send(
                    'Отправь квест в формате username, name, url, characterId, isBlitz' +
                        ' через перенос строки, при этом isBlitz как "да"/"нет"',
                    ctx.buttonList(ECancelButton),
                );
                await ctx.setState<AdminScenario>([AdminScenario, 'addQuest']);
                break;

            case EAdminOptions.DEACTIVATE_QUEST:
                await ctx.send('Введите id квеста', ctx.buttonList(ECancelButton));
                await ctx.setState<AdminScenario>([AdminScenario, 'deactivateQuest']);
                break;

            case EAdminOptions.ACTIVATE_QUEST:
                await ctx.send('Введите id квеста', ctx.buttonList(ECancelButton));
                await ctx.setState<AdminScenario>([AdminScenario, 'activateQuest']);
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
    @BackIfCancel()
    async massSendInput(ctx: TelegramContext<ECancelButton | string>): Promise<void> {
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
    @BackIfCancel()
    async getQuestList(ctx: TelegramContext): Promise<void> {
        const quests = (await this.questModel.findAll({ include: [User] })) || [];
        const message = quests
            .sort((q) => (q.isActive ? -1 : 1))
            .map((q) => {
                const activeSymbol = q.isActive ? '✅' : '⏸';
                const character = Object.values(ECharacterOptions)[q.character];
                const rating = q.rating.toFixed(2);

                return [
                    `${activeSymbol} ⭐️ ${rating} - 🎮 ${q.playedCount}`,
                    `🆔 ${q.id} - ${q.name}`,
                    `🎭 ${character}`,
                    `🔗 ${q.url}`,
                ].join('\n');
            })
            .join('\n\n');

        await ctx.send(message || 'Ни одного квеста!');
        await ctx.setState<AdminScenario>([AdminScenario, 'mainMenuSelect']);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    @BackIfCancel()
    async addQuest(ctx: TelegramContext): Promise<void> {
        let [username, name, url, characterId, isBlitzText] = ctx.message.split('\n');

        if (!username || !name || !url || !characterId || !isBlitzText) {
            await ctx.send('Невалидные аргументы');
            return;
        }

        username = username.trim();
        name = name.trim();
        url = url.trim();
        characterId = characterId.trim();
        isBlitzText = isBlitzText.trim();

        if (username.startsWith('@')) {
            username = username.slice(1, username.length);
        }

        const character = Number(characterId);
        const isBlitz = isBlitzText === 'да';

        const user = await this.userModel.findOne({ where: { username } });

        if (!user) {
            await ctx.send('Пользователь не найден');
            return;
        }

        await this.questModel.create({
            userId: user.id,
            name,
            url,
            character,
            isBlitz,
            rating: 5,
            playedCount: 0,
            isActive: false,
        });

        await ctx.send('Успешно! Не забудь активировать когда нужно.');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    @BackIfCancel()
    async deactivateQuest(ctx: TelegramContext): Promise<void> {
        const quest = await this.questModel.findOne({ where: { id: Number(ctx.message) } });

        if (!quest) {
            await ctx.send('Не найден');
            return;
        }

        if (!quest.isActive) {
            await ctx.send('Уже не активный!');
            return;
        }

        quest.isActive = false;

        await quest.save();
        await ctx.send('Успешно!');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
    }

    @TgStateHandler()
    @OnlyFor({ isAdmin: true })
    @BackIfCancel()
    async activateQuest(ctx: TelegramContext): Promise<void> {
        const quest = await this.questModel.findOne({ where: { id: Number(ctx.message) } });

        if (!quest) {
            await ctx.send('Не найден');
            return;
        }

        if (quest.isActive) {
            await ctx.send('Уже активный!');
            return;
        }

        quest.isActive = true;

        await quest.save();
        await ctx.send('Успешно!');
        await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
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
