import * as TelegramBot from 'node-telegram-bot-api';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { handlers } from './telegram.decorator';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { ModuleRef } from '@nestjs/core';
import { KeyboardButton } from 'node-telegram-bot-api';
import { TelegramContext } from './telegram.context';

@Injectable()
export class TelegramService implements OnModuleInit {
    private readonly logger: Logger = new Logger(TelegramService.name);
    private bot: TelegramBot;
    private admins: Array<string>;

    constructor(private configService: ConfigService, private userService: UserService, private moduleRef: ModuleRef) {}

    onModuleInit(): void {
        this.bot = new TelegramBot(this.configService.get('FF_TG_KEY'), { polling: true });
        this.admins = JSON.parse(this.configService.get('FF_ADMINS'));

        this.bot.on('message', async (message: TelegramBot.Message, metadata: TelegramBot.Metadata) => {
            await this.tryHandle(message, async () => await this.handleAnyMessage(message, metadata));
        });
    }

    async sendText(user: User, message: string, buttons?: Array<Array<string>> | false): Promise<void> {
        const options: TelegramBot.SendMessageOptions = {};

        if (buttons) {
            const keyboard: Array<Array<KeyboardButton>> = buttons.map(
                (row: Array<string>): Array<KeyboardButton> =>
                    row.map(
                        (text: string): KeyboardButton => ({
                            text,
                        }),
                    ),
            );

            options.reply_markup = {
                keyboard,
                resize_keyboard: true,
            };
        }

        if (buttons === false) {
            options.reply_markup = { remove_keyboard: true };
        }

        await this.bot.sendMessage(user.chatId, message, options);
    }

    async redirectToHandler(user: User, state: string, message?: string): Promise<void> {
        await this.tryHandle({ chat: { id: user.chatId, type: null } }, async (): Promise<void> => {
            const context: TelegramContext = new TelegramContext(
                this.userService,
                this,
                user,
                message,
                this.admins.includes(user.username),
            );
            const { handlerClass, handlerMethodName } = handlers.get(state);

            this.moduleRef.get(handlerClass, { strict: false })[handlerMethodName](context);
        });
    }

    private async handleAnyMessage(message: TelegramBot.Message, metadata: TelegramBot.Metadata): Promise<void> {
        const user: User = await this.userService.getUser(message);

        if (user.isBanned) {
            await this.sendBanMessage(message);
            return;
        }

        if (!user.isInvited) {
            await this.sendInviteMessage(message);
            return;
        }

        switch (metadata.type) {
            case 'text':
                await this.handleText(user, message);
                break;

            case 'photo':
                await this.handlePhoto(user, message);
                break;

            case 'audio':
                await this.justSend(
                    message,
                    'Эх, бот хотел бы послушать сообщение, да не умеет...' +
                        ' но умеет читать и смотреть фотки, попробуй так :)',
                );
                break;

            case 'video':
                await this.justSend(message, 'Бот хотел бы видео посмотреть... но не умеет. Может фото? :)');
                break;

            case 'document':
                await this.justSend(
                    message,
                    'Ой, а это фото? Если да, то попробуй через фото отправить,' +
                        ' не через документы. А если это прямо документ... бот такое не умеет,' +
                        ' но умеет текст и обычные фотки, попробуй что-нибудь такое :)',
                );
                break;

            case 'sticker':
                await this.justSend(message, 'Бот не видит стикеры, но надеется что там что-то прикольное :)');
                break;

            case 'contact':
                await this.justSend(
                    message,
                    'Бот не умеет читать телеграмм-контакты, но можешь написать просто текстом :)',
                );
                break;

            case 'location':
                await this.justSend(
                    message,
                    'Ух ты - локация! Жаль что бот не умеет в GPS или что там у нас сейчас...' +
                        ' А вот текст или фотки бот обязательно посмотрит :)',
                );
                break;

            default:
                await this.justSend(message, 'А бот не умеет этот тип сообщений... попробуй текстом :)');
        }
    }

    private async handleText(user: User, message: TelegramBot.Message): Promise<void> {
        let state: string = user.state;

        if (!user.state || message.text === '/start' || message.text === '/reset') {
            state = 'root->root';
        }

        const { handlerClass, handlerMethodName } = handlers.get(state);
        const context: TelegramContext = new TelegramContext(
            this.userService,
            this,
            user,
            message.text,
            this.admins.includes(user.username),
        );

        this.moduleRef.get(handlerClass, { strict: false })[handlerMethodName](context);
    }

    private async handlePhoto(user: User, message: TelegramBot.Message): Promise<void> {
        let state: string = user.state;

        const { handlerClass, handlerMethodName, isPhotoAllowed } = handlers.get(state);

        if (!isPhotoAllowed) {
            await this.justSend(
                message,
                'Неожиданно...' +
                    ' В этом пункте диалога бот в картинки то и не умеет,' +
                    ' но там что-то прикольное ведь, да? :)',
            );
            return;
        }

        const context: TelegramContext = new TelegramContext(
            this.userService,
            this,
            user,
            message.text,
            this.admins.includes(user.username),
        );

        this.moduleRef.get(handlerClass, { strict: false })[handlerMethodName](context);
    }

    private async sendBanMessage(message: Pick<TelegramBot.Message, 'chat'>): Promise<void> {
        await this.justSend(message, 'Похоже что вы забанены :(');
    }

    private async sendInviteMessage(message: Pick<TelegramBot.Message, 'chat'>): Promise<void> {
        await this.justSend(
            message,
            'Привет!\n\n' +
                'Так вышло, что для защиты от ботов и для дружелюбия окружения -' +
                ' у нас тут чуть-чуть по приглашениям. Ты сможешь пользоваться' +
                'всеми благами, как только кто-то тебя пригласит.',
        );
    }

    private async justSend(message: Pick<TelegramBot.Message, 'chat'>, text: string): Promise<void> {
        await this.bot.sendMessage(message.chat.id, text);
    }

    private async tryHandle(message: Pick<TelegramBot.Message, 'chat'>, handler: Function): Promise<void> {
        try {
            await handler();
        } catch (error) {
            this.logger.error(error);

            try {
                await this.justSend(message, 'Ой, что-то пошло не так...');
            } catch (error) {
                this.logger.error(error);
            }
        }
    }
}
