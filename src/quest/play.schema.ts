/*@Schema({ versionKey: false })
export class RatingDefinition {
    _id?: mongoose.Schema.Types.ObjectId | string;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    from: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    target: mongoose.Schema.Types.ObjectId;

    @Prop()
    value: number;
}

export type Rating = RatingDefinition & Document;
export const RatingSchema: mongoose.Schema<Rating> = SchemaFactory.createForClass<RatingDefinition, Rating>(
    RatingDefinition,
);

@Schema({ versionKey: false })
export class PlayDefinition {
    _id?: mongoose.Schema.Types.ObjectId | string;

    @Prop()
    quest: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [mongoose.Schema.Types.ObjectId] })
    players: Array<mongoose.Schema.Types.ObjectId>;

    @Prop({ type: [RatingSchema] })
    questRating: Array<Rating>;

    @Prop({ type: [RatingSchema] })
    playersRating: Array<Rating>;
}

export type Play = PlayDefinition & Document;
export const PlaySchema: mongoose.Schema<Play> = SchemaFactory.createForClass<PlayDefinition, Play>(PlayDefinition);
*/