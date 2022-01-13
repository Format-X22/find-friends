import { Module } from '@nestjs/common';
import { EditorScenario } from './editor.scenario';

@Module({
    providers: [EditorScenario],
    exports: [EditorScenario],
})
export class EditorModule {}
