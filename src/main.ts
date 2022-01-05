import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplicationContext } from '@nestjs/common';
import { Invite, User } from './user/user.model';

async function bootstrap(): Promise<void> {
    await NestFactory.createApplicationContext(AppModule);
    await User.sync({ alter: { drop: false } });
    await Invite.sync({ alter: { drop: false } });
}
bootstrap();
