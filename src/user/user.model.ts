import { ECharacterOptions, EIntensiveOptions } from '../game/options/options.scenario';
import { Column, DataType, HasMany, Model, Table, Unique } from 'sequelize-typescript';
import { Invite } from '../game/invite/invite.model';

@Table
export class User extends Model {
    @Unique
    @Column(DataType.INTEGER)
    userId: number;

    @Column(DataType.BOOLEAN)
    isActive: boolean;

    @Column(DataType.BOOLEAN)
    isBanned: boolean;

    @Column(DataType.BOOLEAN)
    isBoring: boolean;

    @Column(DataType.STRING(255))
    firstName: string;

    @Column(DataType.STRING(255))
    lastName: string;

    @Column(DataType.STRING(255))
    username: string;

    @Column(DataType.STRING(64))
    tgLang: string;

    @Column(DataType.INTEGER)
    chatId: number;

    @Column(DataType.STRING(128))
    state: string;

    @Column(DataType.ENUM(...Object.values(ECharacterOptions)))
    character: ECharacterOptions;

    @Column(DataType.ENUM(...Object.values(EIntensiveOptions)))
    intensive: EIntensiveOptions;

    @Column(DataType.STRING(2048))
    about: string;

    @HasMany(() => User, 'id')
    alreadyPlaysWith: Array<User>;

    @HasMany(() => Invite, 'inviterUsername')
    invites: Array<Invite>;
}
