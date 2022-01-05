import { Global, Module } from '@nestjs/common';
import { QuestModule } from '../quest/quest.module';
import { AdminModule } from './admin/admin.module';
import { InviteModule } from './invite/invite.module';
import { OptionsModule } from './options/options.module';
import { PayModule } from './pay/pay.module';
import { RootModule } from './root/root.module';
import { EditorModule } from './editor/editor.module';

@Global()
@Module({
    imports: [QuestModule, AdminModule, InviteModule, OptionsModule, PayModule, RootModule, EditorModule],
    providers: [],
})
export class GameModule {}
