import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ECharacterOptions, EIntensiveOptions } from '../game/options.scenario';

@Schema({ versionKey: false })
export class UserDefinition {
    _id: mongoose.Schema.Types.ObjectId | string;

    @Prop()
    userId: number;

    @Prop({ type: Boolean, default: (): boolean => true })
    isActive: boolean;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    username: string;

    @Prop()
    tgLang: string;

    @Prop()
    chatId: number;

    @Prop()
    state: string;

    @Prop({ type: String, default: (): string => ECharacterOptions.BALANCE })
    character: ECharacterOptions;

    @Prop({ type: String, default: (): string => EIntensiveOptions.MEDIUM })
    intensive: EIntensiveOptions;

    @Prop()
    about: string;

    @Prop({ type: [mongoose.Schema.Types.ObjectId] })
    alreadyPlaysWith: Array<mongoose.Schema.Types.ObjectId | string>;
}

export type User = UserDefinition & Document;
export const UserSchema: mongoose.Schema<User> = SchemaFactory.createForClass<UserDefinition, User>(UserDefinition);
