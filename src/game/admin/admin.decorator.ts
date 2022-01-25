import { TelegramContext } from '../../telegram/telegram.context';
import { AdminScenario, ECancelButton } from './admin.scenario';

export const BackIfCancel = (): MethodDecorator => {
    return (target: Record<string, any>, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void => {
        const method = descriptor.value;

        descriptor.value = async function (ctx: TelegramContext) {
            if (ctx.message === ECancelButton.CANCEL) {
                await ctx.redirect<AdminScenario>([AdminScenario, 'mainMenu']);
                return;
            }

            await method.call(this, ctx);
        };
    };
};
