import * as TelegramBot from 'node-telegram-bot-api';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { handlers } from './telegram.decorator';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.schema';
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

        this.bot.on('message', async (message: TelegramBot.Message, metadata: TelegramBot.Metadata): Promise<void> => {
            await this.tryHandle(message, async (): Promise<void> => await this.handleAnyMessage(message, metadata));
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
            const [target, methodName]: [new () => object, string] = handlers.get(state);

            this.moduleRef.get(target, { strict: false })[methodName](context);
        });
    }

    private async handleAnyMessage(message: TelegramBot.Message, metadata: TelegramBot.Metadata): Promise<void> {
        switch (metadata.type) {
            case 'text':
                await this.handleText(message);
                break;

            case 'photo':
                await this.handlePhoto(message);
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

    private async handleText(message: TelegramBot.Message): Promise<void> {
        const user: User = await this.userService.getUser(message);

        if (user.isBanned) {
            await this.sendBunMessage(message);
            return;
        }

        const state: string = user.state || 'root->root';
        const [target, methodName]: [new () => object, string] = handlers.get(state);
        const context: TelegramContext = new TelegramContext(
            this.userService,
            this,
            user,
            message.text,
            this.admins.includes(user.username),
        );

        this.moduleRef.get(target, { strict: false })[methodName](context);
    }

    private async handlePhoto(message: TelegramBot.Message): Promise<void> {
        const user: User = await this.userService.getUser(message);

        if (user.isBanned) {
            await this.sendBunMessage(message);
            return;
        }

        // TODO -
        await this.justSend(message, '[временно отключено]');
    }

    private async sendBunMessage(message: Pick<TelegramBot.Message, 'chat'>): Promise<void> {
        await this.justSend(message, 'Похоже что вы забанены :(');
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
