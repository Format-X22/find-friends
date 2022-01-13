import { Module } from '@nestjs/common';
import { AdminScenario } from './admin.scenario';
import { ModelsModule } from '../../models/models.module';

@Module({
    imports: [ModelsModule],
    providers: [AdminScenario],
    exports: [AdminScenario],
})
export class AdminModule {}
