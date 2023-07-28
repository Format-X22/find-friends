import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './definition/user.model';
import { Invite } from './definition/invite.model';
import { Quest } from './definition/quest.model';
import { Game, GamePlayer, GamePlayerFeedback } from './definition/game.model';

@Module({
    imports: [SequelizeModule.forFeature([User, Invite, Quest, Game, GamePlayer, GamePlayerFeedback])],
    providers: [ModelsService],
    exports: [ModelsService],
})
export class ModelsModule {}
