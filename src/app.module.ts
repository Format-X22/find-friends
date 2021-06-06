import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { GameModule } from './game/game.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): MongooseModuleOptions => ({
                uri: configService.get<string>('FF_MONGO'),
            }),
            inject: [ConfigService],
        }),
        UserModule,
        TelegramModule,
        GameModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
