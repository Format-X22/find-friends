import { forwardRef, Global, Module } from '@nestjs/common';
import './options.scenario';
import './pay.scenario';
import './quest.scenario';

@Global()
@Module({
    imports: [],
    providers: [],
    exports: [],
})
export class GameModule {}
