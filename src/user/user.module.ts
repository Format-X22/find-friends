import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Invite } from '../game/invite/invite.model';

@Global()
@Module({
    imports: [SequelizeModule.forFeature([User, Invite])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
