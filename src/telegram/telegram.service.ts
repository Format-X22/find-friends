import * as TelegramBot from 'node-telegram-bot-api';
import { Injectable } from '@nestjs/common';
import { handlers } from './telegram.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
    constructor(private configService: ConfigService) {}

    onModuleInit(): void {
        const bot: TelegramBot = new TelegramBot(this.configService.get('FF_TG_KEY'), { polling: true });

        bot.on('message', async (message: TelegramBot.Message, metadata: TelegramBot.Metadata): Promise<void> => {
            // TODO -
            // TODO Errors handlers
            // TODO Message queue
            console.log(metadata, message);

            await bot.sendMessage(message.chat.id, 'ok');
        });
    }

    async setState(state: string): Promise<void> {
        // TODO 0
    }
}
