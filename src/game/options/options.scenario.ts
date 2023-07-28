import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';
import { RootScenario } from '../root/root.scenario';
import { ECharacterOptions, EIntensiveOptions } from '../../models/definition/user.model';
import { OnlyFor } from '../../user/user.decorator';

enum EOptionsList {
    CHARACTER = 'Характер заданий',
    INTENSIVE = 'Интенсивность игры',
    ABOUT = 'Чуть-чуть о себе',
    PAUSE = 'Приостановить новые задания',
    PAY = 'Платежи',
    BACK = '(назад)',
}

export enum ECharacterOptionsExtraMenu {
    CANCEL = '(отмена)',
}

export enum EIntensiveOptionsExtraMenu {
    CANCEL = '(отмена)',
}

enum EAboutOptions {
    CANCEL = '(отменить)',
    CLEAR = '(стереть)',
}

@TgController()
export class OptionsScenario {
    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async optionsList(ctx: TelegramContext): Promise<void> {
        await ctx.send(
            'Отлично, тут можно настроить игру под себя, ну и рассказать другим чуть-чуть о себе.' +
                '\n\nСейчас у тебя такие настройки:' +
                '\n\n' +
                `Характер заданий => ${ctx.user.character}\n` +
                `Интенсивность игры => ${ctx.user.intensive}\n` +
                `О себе => ${ctx.user.about || '<пусто>'}\n`,
            ctx.buttonList(EOptionsList),
        );
        await ctx.setState<OptionsScenario>([OptionsScenario, 'optionsSelect']);
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async optionsSelect(ctx: TelegramContext<EOptionsList>): Promise<void> {
        switch (ctx.message) {
            case EOptionsList.CHARACTER:
                await ctx.send(
                    'Тут можно настроить характер игры - ненапряжный отдых или суровое саморазвитие?' +
                        ' А может и того и другого? Или просто пообщаться в теплой компании на отвлеченные темы?' +
                        ' А можно ли думать и веселиться одновременно? Выбирай "саморазвитие" если тебя интересуют' +
                        ' люди и задания с саморазвитием, сложные штуки с подготовкой и прочее. Или выбирай' +
                        ' "развлечения" если тебе и так хватает сложности и хочется просто и ненапряжно сбросить' +
                        ' мысли и поразвлекаться в компании близких по духу людей.' +
                        '\n\nОднако - рекомендуем попробовать и так и сяк - новый опыт это всегда яркое событие :)',
                    ctx.buttonList({ ...ECharacterOptions, ...ECharacterOptionsExtraMenu }),
                );
                await ctx.setState<OptionsScenario>([OptionsScenario, 'characterSelect']);
                break;

            case EOptionsList.INTENSIVE:
                await ctx.send(
                    'Тут можно настроить интенсивность игры.' +
                        ' Чем выше интенсивность - тем чаще будут появляться' +
                        ' новые задания и тем больше их может быть параллельно.' +
                        ' Ну и наоборот :) Выбирай то что тебе комфортно - добавить' +
                        ' немного нового в жизнь или сделать её сразу на порядок ярче?',
                    ctx.buttonList({ ...EIntensiveOptions, ...EIntensiveOptionsExtraMenu }),
                );
                await ctx.setState<OptionsScenario>([OptionsScenario, 'intensiveSelect']);
                break;

            case EOptionsList.ABOUT:
                await ctx.send(
                    'Можно написать чуть-чуть о себе, эта информация будет показана' +
                        ' вашим партнерам по заданию перед началом.',
                    ctx.buttonList(EAboutOptions),
                );
                await ctx.setState<OptionsScenario>([OptionsScenario, 'aboutInput']);
                break;

            case EOptionsList.PAUSE:
                await this.pauseGame(ctx);
                break;

            case EOptionsList.BACK:
                await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
                break;

            default:
                await ctx.send('Ой, а такой настройки нет...');
                await ctx.redirect<OptionsScenario>([OptionsScenario, 'optionsList']);
        }
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async characterSelect(ctx: TelegramContext<ECharacterOptions & ECharacterOptionsExtraMenu>): Promise<void> {
        switch (ctx.message) {
            case ECharacterOptions.FULL_FUN:
            case ECharacterOptions.MORE_FUN:
            case ECharacterOptions.BALANCE:
            case ECharacterOptions.MORE_INTELLIGENCE:
            case ECharacterOptions.FULL_INTELLIGENCE:
                ctx.user.character = ctx.message;

                await ctx.user.save();
                break;

            case ECharacterOptionsExtraMenu.CANCEL:
                await this.cancel(ctx);
                return;

            default:
                await this.unknownOption(ctx);
                return;
        }

        await this.successSave(ctx);
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async intensiveSelect(ctx: TelegramContext<EIntensiveOptions & EIntensiveOptionsExtraMenu>): Promise<void> {
        switch (ctx.message) {
            case EIntensiveOptions.MAX:
            case EIntensiveOptions.HIGH:
            case EIntensiveOptions.MEDIUM:
            case EIntensiveOptions.LOW:
            case EIntensiveOptions.MIN:
                ctx.user.intensive = ctx.message;

                await ctx.user.save();
                break;

            case EIntensiveOptions.PAUSE:
                await this.pauseGame(ctx);
                return;

            case EIntensiveOptionsExtraMenu.CANCEL:
                await this.cancel(ctx);
                return;

            default:
                await this.unknownOption(ctx);
                return;
        }

        await this.successSave(ctx);
    }

    @TgStateHandler()
    @OnlyFor({ isActive: true })
    async aboutInput(ctx: TelegramContext<EAboutOptions | string>): Promise<void> {
        switch (ctx.message) {
            case EAboutOptions.CANCEL:
                await this.cancel(ctx);
                return;

            case EAboutOptions.CLEAR:
                ctx.user.about = null;
                break;

            default:
                if (ctx.message.length > 2048) {
                    await ctx.send('Длинннновато получилось, получится уместить в 2048 символов?');
                    return;
                }

                ctx.user.about = ctx.message;
        }

        await ctx.user.save();
        await this.successSave(ctx);
    }

    private async cancel(ctx: TelegramContext): Promise<void> {
        await ctx.send('Отменено...');
        await ctx.redirect<OptionsScenario>([OptionsScenario, 'optionsList']);
    }

    private async unknownOption(ctx: TelegramContext): Promise<void> {
        await ctx.send('Хм, похоже такой настройки нет...');
    }

    private async successSave(ctx: TelegramContext): Promise<void> {
        await ctx.send('Изменения сохранены.');
        await ctx.redirect<OptionsScenario>([OptionsScenario, 'optionsList']);
    }

    private async pauseGame(ctx: TelegramContext): Promise<void> {
        await ctx.send('Хорошо, игра поставлена на паузу. Возвращайся когда захочешь :)');

        ctx.user.isActive = false;

        await ctx.user.save();
        await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);
    }
}
