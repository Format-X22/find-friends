import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ECharacterOptions, EIntensiveOptions, User } from '../models/definition/user.model';
import { Invite } from '../models/definition/invite.model';
import { TState } from '../telegram/telegram.decorator';
import { ModelsService } from '../models/models.service';

@Injectable()
export class UserService {
    private readonly userModel: typeof User;
    private readonly inviteModel: typeof Invite;

    constructor(private modelsService: ModelsService) {
        this.userModel = this.modelsService.userModel;
        this.inviteModel = this.modelsService.inviteModel;
    }

    async getUser(message: TelegramBot.Message): Promise<User> {
        const tgValues: Partial<User> = {
            userId: message.from.id,
            tgLang: message.from.language_code,
            chatId: message.chat.id,
            firstName: message.chat.first_name,
            lastName: message.chat.last_name,
            username: message.chat.username,
        };

        let user = await this.userModel.findOne({ where: { chatId: message.chat.id }, include: [Invite] });

        if (user) {
            await user.update(tgValues);
        } else {
            const isInvited = await this.inviteModel.findOne({ where: { invitedUsername: tgValues.username } });

            user = await this.userModel.create({
                chatId: message.chat.id,
                character: ECharacterOptions.BALANCE,
                intensive: EIntensiveOptions.MEDIUM,
                isInvited: Boolean(isInvited),
                ...tgValues,
            });
        }

        return user;
    }

    async setState<T>(user: User, state: TState<T>): Promise<void> {
        await this.userModel.update({ state: `${state[0].name}->${String(state[1])}` }, { where: { userId: user.userId } });
    }
}
