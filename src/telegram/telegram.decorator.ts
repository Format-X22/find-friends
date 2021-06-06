type TSavePath<T> = (statePath: string) => T;
type THandlersPoints = Map<string, Function>;
type THandlersByClass = Map<Function, THandlersPoints>;
export type THandlers = Map<string, Function>;

const handlersByClass: THandlersByClass = new Map();
export const handlers: THandlers = new Map();

export const TgController: TSavePath<ClassDecorator> = (stateSection: string = 'root'): ClassDecorator => {
    return (target: Function): void => {
        const targetHandlers: THandlersPoints = handlersByClass.get(target);

        for (const [point, handler] of targetHandlers) {
            handlers.set(`${stateSection}->${point}`, handler);
        }
    };
};

export const TgStateHandler: TSavePath<MethodDecorator> = (statePoint: string = 'root'): MethodDecorator => {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor): void => {
        let targetHandlers: THandlersPoints = handlersByClass.get(target.constructor);

        if (!targetHandlers) {
            targetHandlers = new Map();

            handlersByClass.set(target.constructor, targetHandlers);
        }

        targetHandlers.set(statePoint, descriptor.value);
    };
};
