import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {  User } from './user/user.model';
import { Invite } from './game/invite/invite.model';

async function bootstrap(): Promise<void> {
    await NestFactory.createApplicationContext(AppModule);
    await User.sync({ alter: { drop: false } });
    await Invite.sync({ alter: { drop: false } });
}
bootstrap();
