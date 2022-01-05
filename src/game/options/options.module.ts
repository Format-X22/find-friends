import { Module } from '@nestjs/common';
import { OptionsScenario } from './options.scenario';

@Module({
    providers: [OptionsScenario],
    exports: [OptionsScenario],
})
export class OptionsModule {}
