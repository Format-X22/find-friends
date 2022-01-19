import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
    isModerated: boolean;

    @Column(DataType.STRING(512))
    cancelReason: string;

    @Column(DataType.BOOLEAN)
    isExperimental: boolean;

    @Column(DataType.BOOLEAN)
    isInGame: boolean;

    @Column(DataType.FLOAT)
    rating: number;

    @Column(DataType.INTEGER)
    playedCount: number;
}
