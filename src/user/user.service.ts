import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getUser(message: TelegramBot.Message): Promise<User> {
        await this.userModel.updateOne(
            { chatId: message.chat.id },
            {
                $set: {
                    userId: message.from.id,
                    tgLang: message.from.language_code,
                    chatId: message.chat.id,
                    firstName: message.chat.first_name,
                    lastName: message.chat.last_name,
                    username: message.chat.username,
                },
            },
            { upsert: true },
        );

        return this.userModel.findOne({ chatId: message.chat.id });
    }

    async setState(user: User, state: string): Promise<void> {
        await this.userModel.updateOne({ _id: user._id }, { $set: { state } });
    }
}
