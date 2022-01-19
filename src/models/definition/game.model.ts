import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Quest } from './quest.model';
import { User } from './user.model';

@Table
export class Game extends Model {
    @ForeignKey(() => Quest)
    @Column
    questId: number;

    @Column(DataType.BOOLEAN)
    isFullDone: boolean;

    @Column(DataType.BOOLEAN)
    isHandled: boolean;

    @HasMany(() => GamePlayer)
    players: Array<GamePlayer>;

    @HasMany(() => GamePlayerFeedback)
    playersFeedback: Array<GamePlayerFeedback>;
}

@Table
export class GamePlayer extends Model {
    @ForeignKey(() => Game)
    @Column
    gameId: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @Column(DataType.FLOAT)
    questRating: number;

    @Column(DataType.TEXT)
    questFeedback: string;

    @Column(DataType.BOOLEAN)
    isDone: boolean;
}

@Table
export class GamePlayerFeedback extends Model {
    @ForeignKey(() => Game)
    @Column
    gameId: number;

    @ForeignKey(() => User)
    @Column
    fromUserId: number;

    @ForeignKey(() => User)
    @Column
    toUserId: number;

    @Column(DataType.FLOAT)
    rating: number;

    @Column(DataType.TEXT)
    feedback: number;
}
