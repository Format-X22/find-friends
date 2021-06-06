import { DEFAULT_STATE } from '../user/user.schema';
import { applyDecorators, Injectable } from '@nestjs/common';

type TSavePath<T> = (statePath?: string) => T;
type THandlersPoints = Map<string, string>;
type THandlersByClass = Map<Function, THandlersPoints>;

export type THandlers = Map<string, [new () => object, string]>;

const handlersByClass: THandlersByClass = new Map();
export const handlers: THandlers = new Map();

export const TgController: TSavePath<ClassDecorator> = (stateSection: string = DEFAULT_STATE): ClassDecorator => {
    return applyDecorators(Injectable, (target: Function): void => {
        const targetHandlers: THandlersPoints = handlersByClass.get(target);

        if (!targetHandlers) {
            return;
        }

        for (const [point, handlerName] of targetHandlers) {
            let state: string = `${stateSection}->${point}`;

            if (stateSection === DEFAULT_STATE && point === DEFAULT_STATE) {
                state = DEFAULT_STATE;
            }

            handlers.set(state, [target as new () => object, handlerName]);
        }
    });
};

export const TgStateHandler: TSavePath<MethodDecorator> = (statePoint: string = DEFAULT_STATE): MethodDecorator => {
    return (target: object, propertyKey: string): void => {
        let targetHandlers: THandlersPoints = handlersByClass.get(target.constructor);

        if (!targetHandlers) {
            targetHandlers = new Map();

            handlersByClass.set(target.constructor, targetHandlers);
        }

        targetHandlers.set(statePoint, propertyKey);
    };
};

// TODO Support photo handler
export const TgSupportPhoto: void = null;
