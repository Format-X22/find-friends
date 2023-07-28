import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Quest extends Model {
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
