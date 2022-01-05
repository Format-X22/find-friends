import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Invite extends Model {
    @Column(DataType.STRING(255))
    inviterUsername: string;

    @Column(DataType.STRING(255))
    invitedUsername: string;
}
