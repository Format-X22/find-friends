import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class QuestDefinition {
    _id: mongoose.Schema.Types.ObjectId | string;

    @Prop()
    name: string;
}

export type Quest = QuestDefinition & Document;
export const QuestSchema: mongoose.Schema<Quest> = SchemaFactory.createForClass<QuestDefinition, Quest>(
    QuestDefinition,
);
