import { Global, Module } from '@nestjs/common';
import { RootScenario } from './root.scenario';
import { PayScenario } from './pay.scenario';
import { QuestScenario } from './quest.scenario';
import { OptionsScenario } from './options.scenario';
import { QuestModule } from '../quest/quest.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDefinition, UserSchema } from '../user/user.schema';
import { AdminScenario } from './admin.scenario';

@Global()
@Module({
    imports: [QuestModule, MongooseModule.forFeature([{ name: UserDefinition.name, schema: UserSchema }])],
    providers: [RootScenario, PayScenario, QuestScenario, OptionsScenario, AdminScenario],
    exports: [RootScenario, PayScenario, QuestScenario, OptionsScenario, AdminScenario],
})
export class GameModule {}
