import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './definition/user.model';
import { Invite } from './definition/invite.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Invite])],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule {}
