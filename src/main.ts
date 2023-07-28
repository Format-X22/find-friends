import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './models/definition/user.model';
import { Invite } from './models/definition/invite.model';
import { Quest } from './models/definition/quest.model';
import { Game, GamePlayer, GamePlayerFeedback } from './models/definition/game.model';

async function bootstrap(): Promise<void> {
    const syncOptions = { alter: { drop: false } };

    await NestFactory.createApplicationContext(AppModule);
    await User.sync(syncOptions);
    await Invite.sync(syncOptions);
    await Quest.sync(syncOptions);
    await Game.sync(syncOptions);
    await GamePlayer.sync(syncOptions);
    await GamePlayerFeedback.sync(syncOptions);
}
bootstrap();
