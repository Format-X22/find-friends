import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class User {
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
}

export type UserDocument = User & Document;
export const UserSchema: mongoose.Schema<UserDocument> = SchemaFactory.createForClass<User, UserDocument>(User);
