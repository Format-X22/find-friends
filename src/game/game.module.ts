import { Global, Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { InviteModule } from './invite/invite.module';
import { OptionsModule } from './options/options.module';
import { PayModule } from './pay/pay.module';
import { RootModule } from './root/root.module';
import { QuestModule } from './quest/quest.module';

@Global()
@Module({
    imports: [QuestModule, AdminModule, InviteModule, OptionsModule, PayModule, RootModule],
    providers: [],
})
export class GameModule {}
