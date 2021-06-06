import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const DEFAULT_STATE: string = 'root';

@Schema({ versionKey: false })
export class UserDefination {
    _id: mongoose.Schema.Types.ObjectId | string;

    @Prop()
    userId: number;

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

    @Prop({ default: DEFAULT_STATE })
    state: string;

    @Prop()
    character: string;

    @Prop()
    intensive: string;

    @Prop()
    about: string;
}

export type User = UserDefination & Document;
export const UserSchema: mongoose.Schema<User> = SchemaFactory.createForClass<UserDefination, User>(UserDefination);
