import { User } from '../models/definition/user.model';
import { TelegramContext } from '../telegram/telegram.context';
import { RootScenario } from '../game/root/root.scenario';

export const OnlyFor = (flags: Partial<User>): MethodDecorator => {
    return (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void => {
        const method = descriptor.value;

        descriptor.value = async function (ctx: TelegramContext): Promise<void> {
            for (const key of Object.keys(flags)) {
                if (flags[key] != Boolean(ctx.user[key])) {
                    await ctx.send('Этот пункт меню сейчас недоступен...');
                    await ctx.redirect<RootScenario>([RootScenario, 'mainMenu']);

                    return;
                }

                method.apply(this, arguments);
            }
        };
    };
};
