import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

    @Prop()
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
