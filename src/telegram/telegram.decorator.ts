import { applyDecorators, Injectable } from '@nestjs/common';

type TSavePath<T> = () => T;
type THandlersPoints = Set<string>;
type THandlersByClass = Map<Function, THandlersPoints>;

type THandlerTuple = {
    handlerClass: new () => object;
    handlerMethodName: string;
    isPhotoAllowed: boolean;
};
export type TState<T> = [any, keyof T];
export type THandlers = Map<string, THandlerTuple>;

const handlersByClass: THandlersByClass = new Map();
const handlersWithPhotoByClass: THandlersByClass = new Map();
export const handlers: THandlers = new Map();

export const TgController: TSavePath<ClassDecorator> = (): ClassDecorator => {
    return applyDecorators(Injectable, (handlerClass: new () => object): void => {
        const targetHandlers: THandlersPoints = handlersByClass.get(handlerClass);
        const targetHandlersWithPhoto: THandlersPoints = handlersWithPhotoByClass.get(handlerClass);

        if (!targetHandlers) {
            return;
        }

        for (const handlerMethodName of targetHandlers) {
            let state: string = `${handlerClass.name}->${handlerMethodName}`;
            const isPhotoAllowed = targetHandlersWithPhoto?.has(handlerMethodName);

            handlers.set(state, {
                handlerClass,
                handlerMethodName,
                isPhotoAllowed,
            });
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

export const TgAllowPhoto: TSavePath<MethodDecorator> = (statePoint?: string): MethodDecorator => {
    return (target: object, propertyKey: string): void => {
        let targetHandlersWithPhoto: THandlersPoints = handlersWithPhotoByClass.get(target.constructor);

        if (!targetHandlersWithPhoto) {
            targetHandlersWithPhoto = new Set();

            handlersWithPhotoByClass.set(target.constructor, targetHandlersWithPhoto);
        }

        targetHandlersWithPhoto.add(statePoint || propertyKey);
    };
};
