import { UserService } from '../user/user.service';
import { TelegramService } from './telegram.service';
import { User } from '../user/user.schema';

export class TelegramContext<TInboundMessage = string> {
    constructor(
        private userService: UserService,
        private telegramService: TelegramService,
        public user: User,
        public message: TInboundMessage,
        public isAdmin: boolean,
    ) {}

    async send(message: string, buttons?: Array<Array<string>> | false): Promise<void> {
        await this.telegramService.sendText(this.user, message, buttons);
    }

    async setState(state: string): Promise<void> {
        await this.userService.setState(this.user, state);
    }

    async redirect(state: string, message?: string): Promise<void> {
        await this.setState(state);
        await this.telegramService.redirectToHandler(this.user, state, message);
    }

    buttonList(buttons: Record<string, string>): Array<Array<string>> {
        return Object.values(buttons).map((button: string): [string] => [button]);
    }
}
