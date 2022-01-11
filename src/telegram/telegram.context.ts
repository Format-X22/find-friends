import { UserService } from '../user/user.service';
import { TelegramService } from './telegram.service';
import { User } from '../user/user.model';

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

    async setState(state: string): Promise<void> {
        await this.setStateFor(this.user, state);
    }

    async setStateFor(user: User, state: string): Promise<void> {
        await this.userService.setState(user, state);
    }

    async redirect(state: string, withMessageForState?: string): Promise<void> {
        await this.redirectFor(this.user, state, withMessageForState);
    }

    async redirectFor(user: User, state: string, withMessageForState?: string): Promise<void> {
        await this.setStateFor(user, state);
        await this.telegramService.redirectToHandler(user, state, withMessageForState);
    }

    buttonList(buttons: Record<string, string>): Array<Array<string>> {
        return Object.values(buttons).map((button: string): [string] => [button]);
    }
}
