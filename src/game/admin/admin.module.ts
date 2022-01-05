import { Module } from '@nestjs/common';
import { AdminScenario } from './admin.scenario';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../user/user.model';

@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [AdminScenario],
    exports: [AdminScenario],
})
export class AdminModule {}
