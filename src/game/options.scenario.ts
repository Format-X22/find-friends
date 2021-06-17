import { TgController, TgStateHandler } from '../telegram/telegram.decorator';
import { TelegramContext } from '../telegram/telegram.context';

enum EOptionsList {
    CHARACTER = 'Характер заданий',
    INTENSIVE = 'Интенсивность игры',
    ABOUT = 'Чуть-чуть о себе',
    BACK = '(назад)',
}

export enum ECharacterOptions {
    FULL_INTELLIGENCE = 'Максимально саморазвитие',
    MORE_INTELLIGENCE = 'Побольше про саморазвитие',
    BALANCE = 'Выбираю баланс',
    MORE_FUN = 'Побольше веселья',
    FULL_FUN = 'Максимальное веселье',
    CANCEL = '(отмена)',
}

export enum EIntensiveOptions {
    MAX = 'Максимальная',
    HIGH = 'Высокая',
    MEDIUM = 'Средняя',
    LOW = 'Низкая',
    MIN = 'Минимальная',
    CANCEL = '(отмена)',
}

enum EAboutOptions {
    CANCEL = '(отмена)',
}

@TgController('options')
export class OptionsScenario {
    @TgStateHandler()
    async optionsList(ctx: TelegramContext): Promise<void> {
        await ctx.send(
            'Отлично, тут можно настроить игру под себя, ну и рассказать другим чуть-чуть о себе.',
            ctx.buttonList(EOptionsList),
        );
        await ctx.setState('options->optionsSelect');
    }

    @TgStateHandler()
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
                    ctx.buttonList(ECharacterOptions),
                );
                await ctx.setState('options->characterSelect');
                break;

            case EOptionsList.INTENSIVE:
                await ctx.send(
                    'Тут можно настроить интенсивность игры.' +
                        ' Чем выше интенсивность - тем чаще будут появляться' +
                        ' новые задания и тем больше их может быть параллельно.' +
                        ' Ну и наоборот :) Выбирай то что тебе комфортно - добавить' +
                        ' немного нового в жизнь или сделать её сразу на порядок ярче?',
                    ctx.buttonList(EIntensiveOptions),
                );
                await ctx.setState('options->intensiveSelect');
                break;

            case EOptionsList.ABOUT:
                await ctx.send(
                    'Можно написать чуть-чуть о себе, эта информация будет показана' +
                        ' вашим партнерам по заданию перед началом. Не пишите много - максимум 140 символов.',
                    ctx.buttonList(EAboutOptions),
                );
                await ctx.setState('options->aboutInput');
                break;

            case EOptionsList.BACK:
                await ctx.redirect('root->root');
                break;

            default:
                await ctx.send('Ой, а такой настройки нет...');
        }
    }

    @TgStateHandler()
    async characterSelect(ctx: TelegramContext<ECharacterOptions>): Promise<void> {
        switch (ctx.message) {
            case ECharacterOptions.FULL_FUN:
            case ECharacterOptions.MORE_FUN:
            case ECharacterOptions.BALANCE:
            case ECharacterOptions.MORE_INTELLIGENCE:
            case ECharacterOptions.FULL_INTELLIGENCE:
                ctx.user.character = ctx.message;

                await ctx.user.save();
                break;

            case ECharacterOptions.CANCEL:
                await this.cancel(ctx);
                return;

            default:
                await this.unknownOption(ctx);
                return;
        }

        await this.successSave(ctx);
    }

    @TgStateHandler()
    async intensiveSelect(ctx: TelegramContext<EIntensiveOptions>): Promise<void> {
        switch (ctx.message) {
            case EIntensiveOptions.MAX:
            case EIntensiveOptions.HIGH:
            case EIntensiveOptions.MEDIUM:
            case EIntensiveOptions.LOW:
            case EIntensiveOptions.MIN:
                ctx.user.intensive = ctx.message;

                await ctx.user.save();
                break;

            case EIntensiveOptions.CANCEL:
                await this.cancel(ctx);
                return;

            default:
                await this.unknownOption(ctx);
                return;
        }

        await this.successSave(ctx);
    }

    @TgStateHandler()
    async aboutInput(ctx: TelegramContext<EAboutOptions | string>): Promise<void> {
        switch (ctx.message) {
            case EAboutOptions.CANCEL:
                await this.cancel(ctx);
                return;

            default:
                if (ctx.message.length > 140) {
                    await ctx.send('Длинннновато получилось, получится уместить в 140 символов?');
                    return;
                }

                ctx.user.about = ctx.message;

                await ctx.user.save();
        }

        await this.successSave(ctx);
    }

    private async cancel(ctx: TelegramContext): Promise<void> {
        await ctx.send('Отменено...');
        await ctx.redirect('options->optionsList');
    }

    private async unknownOption(ctx: TelegramContext): Promise<void> {
        await ctx.send('Хм, похоже такой настройки нет...');
    }

    private async successSave(ctx: TelegramContext): Promise<void> {
        await ctx.send('Изменения сохранены.');
        await ctx.redirect('options->optionsList');
    }
}
