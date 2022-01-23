import { Module } from '@nestjs/common';
import { EditorScenario } from './editor.scenario';
import { ModelsModule } from '../../models/models.module';

@Module({
    imports: [ModelsModule],
    providers: [EditorScenario],
    exports: [EditorScenario],
})
export class EditorModule {}
