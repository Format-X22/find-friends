import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Quest extends Model {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, 'userId')
    user: User;

    @Column(DataType.STRING(256))
    name: string;

    @Column(DataType.STRING(256))
    url: string;

    @Column(DataType.INTEGER)
    character: number;

    @Column(DataType.BOOLEAN)
    isBlitz: boolean;

    @Column(DataType.BOOLEAN)
    isActive: boolean;

    @Column(DataType.FLOAT)
    rating: number;

    @Column(DataType.INTEGER)
    playedCount: number;
}

@Table
export class QuestRequest extends Model {
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, 'userId')
    user: User;

    @Column(DataType.STRING(256))
    url: string;

    @Column(DataType.BOOLEAN)
    isModerated: boolean;

    @Column(DataType.STRING(512))
    cancelReason: string;

    @Column(DataType.BOOLEAN)
    isApproved: boolean;
}
