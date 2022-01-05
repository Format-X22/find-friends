import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { User } from './user.model';
import { ECharacterOptions, EIntensiveOptions } from '../game/options/options.scenario';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    async getUser(message: TelegramBot.Message): Promise<User> {
        const tgValues: Partial<User> = {
            userId: message.from.id,
            tgLang: message.from.language_code,
            chatId: message.chat.id,
            firstName: message.chat.first_name,
            lastName: message.chat.last_name,
            username: message.chat.username,
        };

        let user = await this.userModel.findOne({ where: { chatId: message.chat.id } });

        if (user) {
            await user.update(tgValues);
        } else {
            user = await this.userModel.create({
                chatId: message.chat.id,
                character: ECharacterOptions.BALANCE,
                intensive: EIntensiveOptions.MEDIUM,
                ...tgValues,
            });
        }

        return user;
    }

    async setState(user: User, state: string): Promise<void> {
        await this.userModel.update({ state }, { where: { userId: user.userId } });
    }
}
