import { Column, DataType, HasMany, Model, Table, Unique } from 'sequelize-typescript';
import { Invite } from './invite.model';

export enum ECharacterOptions {
    FULL_INTELLIGENCE = 'Максимально саморазвитие',
    MORE_INTELLIGENCE = 'Побольше про саморазвитие',
    BALANCE = 'Выбираю баланс',
    MORE_FUN = 'Побольше веселья',
    FULL_FUN = 'Максимальное веселье',
}

export enum EIntensiveOptions {
    MAX = 'Максимальная',
    HIGH = 'Высокая',
    MEDIUM = 'Средняя',
    LOW = 'Низкая',
    MIN = 'Минимальная',
    PAUSE = 'Приостановить новые задания',
}

@Table
export class User extends Model {
    isAdmin: boolean;

    @Unique
    @Column(DataType.INTEGER)
    userId: number;

    @Column(DataType.BOOLEAN)
    isActive: boolean;

    @Column(DataType.BOOLEAN)
    isBanned: boolean;

    @Column(DataType.STRING(256))
    banReason: string;

    @Column(DataType.BOOLEAN)
    isBoring: boolean;

    @Column(DataType.BOOLEAN)
    isInvited: boolean;

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

    @HasMany(() => Invite)
    invites: Array<Invite>;

    @Column(DataType.FLOAT)
    rating: number;
}
