import { applyDecorators, Injectable } from '@nestjs/common';

type TSavePath<T> = (statePath?: string) => T;
type THandlersPoints = Set<string>;
type THandlersByClass = Map<Function, THandlersPoints>;

export type THandlers = Map<string, [new () => object, string]>;

const handlersByClass: THandlersByClass = new Map();
export const handlers: THandlers = new Map();

export const TgController: TSavePath<ClassDecorator> = (stateSection: string): ClassDecorator => {
    return applyDecorators(Injectable, (target: Function): void => {
        const targetHandlers: THandlersPoints = handlersByClass.get(target);

        if (!targetHandlers) {
            return;
        }

        for (const handlerName of targetHandlers) {
            let state: string = `${stateSection}->${handlerName}`;

            handlers.set(state, [target as new () => object, handlerName]);
        }
    });
};

export const TgStateHandler: TSavePath<MethodDecorator> = (statePoint?: string): MethodDecorator => {
    return (target: object, propertyKey: string): void => {
        let targetHandlers: THandlersPoints = handlersByClass.get(target.constructor);

        if (!targetHandlers) {
            targetHandlers = new Set();

            handlersByClass.set(target.constructor, targetHandlers);
        }

        targetHandlers.add(statePoint || propertyKey);
    };
};

// TODO Support photo handler
export const TgSupportPhoto: void = null;
