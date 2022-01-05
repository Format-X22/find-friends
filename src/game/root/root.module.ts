import { Module } from '@nestjs/common';
import { RootScenario } from './root.scenario';

@Module({
    providers: [RootScenario],
    exports: [RootScenario],
})
export class RootModule {}
