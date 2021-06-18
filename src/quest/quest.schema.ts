import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ECharacterOptions } from '../game/options.scenario';

@Schema({ versionKey: false })
export class QuestDefinition {
    _id?: mongoose.Schema.Types.ObjectId | string;

    @Prop()
    humanId: string;

    @Prop()
    name: string;

    @Prop({ type: [String], enum: ECharacterOptions })
    characters: Array<ECharacterOptions>;

    @Prop()
    textUrl: string;
}

export type Quest = QuestDefinition & Document;
export const QuestSchema: mongoose.Schema<Quest> = SchemaFactory.createForClass<QuestDefinition, Quest>(
    QuestDefinition,
);
