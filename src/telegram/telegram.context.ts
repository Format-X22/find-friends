import { UserService } from '../user/user.service';
import { TelegramService } from './telegram.service';
import { User } from '../models/definition/user.model';
import { TState } from './telegram.decorator';

export class TelegramContext<TInboundMessage = string> {
    constructor(
        private userService: UserService,
        private telegramService: TelegramService,
        public user: User,
        public message: TInboundMessage,
        public isAdmin: boolean,
    ) {}

    async send(message: string, buttons?: Array<Array<string>> | false): Promise<void> {
        await this.sendFor(this.user, message, buttons);
    }

    async sendFor(user: User, message: string, buttons?: Array<Array<string>> | false): Promise<void> {
        await this.telegramService.sendText(user, message, buttons);
    }

    async setState<T>(state: TState<T>): Promise<void> {
        await this.setStateFor<T>(this.user, state);
    }

    async setStateFor<T>(user: User, state: TState<T>): Promise<void> {
        await this.userService.setState<T>(user, state);
    }

    async redirect<T>(state: TState<T>, withMessageForState?: string): Promise<void> {
        await this.redirectFor<T>(this.user, state, withMessageForState);
    }

    async redirectFor<T>(user: User, state: TState<T>, withMessageForState?: string): Promise<void> {
        await this.setStateFor<T>(user, state);
        await this.telegramService.redirectToHandler<T>(user, state, withMessageForState);
    }

    buttonList(buttons: Record<string, string>): Array<Array<string>> {
        return Object.values(buttons).map((button: string): [string] => [button]);
    }
}
