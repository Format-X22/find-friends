import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import './telegram.decorator';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';

@Module({
    imports: [UserModule],
    providers: [TelegramService],
})
export class TelegramModule {}
