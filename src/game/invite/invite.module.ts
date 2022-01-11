import { Module } from '@nestjs/common';
import { InviteScenario } from './invite.scenario';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../user/user.model';
import { Invite } from './invite.model';

@Module({
    imports: [SequelizeModule.forFeature([User, Invite])],
    providers: [InviteScenario],
    exports: [InviteScenario],
})
export class InviteModule {}
