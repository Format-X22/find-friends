import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { UserService } from '../user/user.service';
import { TelegramService } from '../telegram/telegram.service';
import { User } from '../user/user.schema';

@TgController()
export class RootScenario {
    constructor(private userService: UserService, private telegramService: TelegramService) {}

    @TgStateHandler()
    async root(user: User): Promise<void> {
        await this.telegramService.sendText(user, 'Ok');
    }
}
