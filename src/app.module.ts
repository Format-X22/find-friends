import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { QuestModule } from './quest/quest.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { Invite } from './game/invite/invite.model';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (cs: ConfigService) => {
                return {
                    dialect: 'postgres',
                    host: cs.get('FF_DB_HOST'),
                    port: cs.get('FF_DB_PORT'),
                    username: cs.get('FF_DB_USERNAME'),
                    password: cs.get('FF_DB_PASSWORD'),
                    database: cs.get('FF_DB_DATABASE_NAME'),
                    models: [User, Invite],
                    autoLoadModels: true,
                    synchronize: true,
                    logging: false,
                }
            }
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
