import { Module } from '@nestjs/common';
import { PayScenario } from './pay.scenario';

@Module({
    providers: [PayScenario],
    exports: [PayScenario],
})
export class PayModule {}
