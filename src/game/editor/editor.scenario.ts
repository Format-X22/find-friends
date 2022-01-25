import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';
import { RootScenario } from '../root/root.scenario';
import { ModelsService } from '../../models/models.service';

enum EBackToMenuButton {
    BACK = '(назад в меню)',
}

@TgController()
export class EditorScenario {
    constructor(private modelsService: ModelsService) {}

    // TODO Example link
    @TgStateHandler()
    async mainMenu(ctx: TelegramContext): Promise<void> {
        await ctx.send(
            'Это раздел для тех кто хочет' +
                ' поучаствовать в игре в роли создателя заданий.' +
                ' Да, так тоже можно и это задание попадет в подборку' +
                ' заданий самой игры, другие люди смогу в него поиграть,' +
                ' а само задание будет отмечено за вашим авторством.' +
                ' А ещё есть рейтинг авторов, всякие ачивки и приятные бонусы!' +
                '\n\nЧтобы отправить задание нужно просто отправить ссылку на' +
                ' https://telegra.ph/ с вашим заданием ответом на это сообщение.' +
                ' Задание пройдет небольшую модерацию и будет опубликовано.' +
                ' А ещё есть маленький гайд как написать интересное задание,' +
                ' примеры как стоит делать и как не стоит, а также всякие' +
                ' подсказки как сделать хорошее задание:' +
                '\n\nhttps://telegra.ph/ (ТУТ БУДЕТ ССЫЛКА)',
            ctx.buttonList(EBackToMenuButton),
        );
        await ctx.setState<EditorScenario>([EditorScenario, 'mainMenuSelect']);
    }

    @TgStateHandler()
    async mainMenuSelect(ctx: TelegramContext<EBackToMenuButton | string>): Promise<void> {
        switch (ctx.message) {
            case EBackToMenuButton.BACK:
                await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
                break;
            default:
                await this.modelsService.questRequestModel.create({
                    url: ctx.message,
                    userId: ctx.user.id,
                    isModerated: false,
                });
                await ctx.send('Задание сохранено! Бот сам напишет по готовности.');
                await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
        }
    }
}
