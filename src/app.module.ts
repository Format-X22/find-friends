import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        TelegramModule,
        GameModule,
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
