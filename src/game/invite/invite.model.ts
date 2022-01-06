import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../user/user.model';

@Table
export class Invite extends Model {
    @ForeignKey(() => User)
    @Column
    dbUserId: number;

    @BelongsTo(() => User)
    dbUser: User;

    @Column(DataType.STRING(255))
    inviterUsername: string;

    @Column(DataType.STRING(255))
    invitedUsername: string;
}
