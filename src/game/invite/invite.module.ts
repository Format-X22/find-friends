import { Module } from '@nestjs/common';
import { InviteScenario } from './invite.scenario';

@Module({
    providers: [InviteScenario],
    exports: [InviteScenario],
})
export class InviteModule {}
