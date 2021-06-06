import { TgController } from '../telegram/telegram.decorator';
import { UserService } from '../user/user.service';
import { TelegramService } from '../telegram/telegram.service';

@TgController('quest')
export class QuestScenario {
    constructor(private userService: UserService, private telegramService: TelegramService) {}

    //
}
