import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { QuestModule } from './quest/quest.module';

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
        QuestModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
