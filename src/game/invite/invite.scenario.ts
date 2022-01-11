import { TgController, TgStateHandler } from '../../telegram/telegram.decorator';
import { TelegramContext } from '../../telegram/telegram.context';
import { Invite } from './invite.model';
import { User } from '../../user/user.model';

enum EInviteButtons {
    CANCEL = '(назад в меню)',
}

@TgController('invite')
export class InviteScenario {
    @TgStateHandler()
    async mainMenu(ctx: TelegramContext): Promise<void> {
        await ctx.send(
            'Для защиты дображелательности комьюнити' +
                ' существует система инвайтов. Каждый участник может пригласить' +
                ' любого пользователя Telegram в наше комьюнити. Для этого' +
                ' нужно написать его никнейм (в виде @username) и отправить,' +
                ' после пользователь сможет участвовать в игре.\n\n' +
                'Вы пригласили:\n\n' +
                (ctx.user.invites.map((invite) => '@' + invite.invitedUsername).join('\n') || '< пока никого >'),
            ctx.buttonList(EInviteButtons),
        );
        await ctx.setState('invite->inviteUser');
    }

    @TgStateHandler()
    async inviteUser(ctx: TelegramContext<EInviteButtons | string>): Promise<void> {
        switch (ctx.message) {
            case EInviteButtons.CANCEL:
                await ctx.redirect('root->mainMenu');
                break;

            default:
                await this.tryInvite(ctx);
        }
    }

    private async tryInvite(ctx: TelegramContext): Promise<void> {
        let username = ctx.message.trim();

        if (username[0] === '@') {
            username = username.slice(1, username.length);
        }

        if (username.startsWith('http')) {
            const usernameSplit = username.split('/');

            username = usernameSplit[usernameSplit.length - 1];
        }

        const maybeInvitedUser = await User.findOne({ where: { username } });

        if (maybeInvitedUser && maybeInvitedUser.isInvited) {
            await ctx.send('Этот пользователь уже участник ;)');
            return;
        }

        const alreadyInvited = await Invite.findOne({ where: { invitedUsername: username } });

        if (alreadyInvited) {
            await ctx.send('Этого пользователя уже пригласил кто-то другой ;)');
            return;
        }

        await Invite.create({
            dbUserId: ctx.user.id,
            inviterUsername: ctx.user.username,
            invitedUsername: username,
        });

        if (maybeInvitedUser) {
            maybeInvitedUser.isInvited = true;
            maybeInvitedUser.state = 'root->root';

            await maybeInvitedUser.save();
            await ctx.sendFor(maybeInvitedUser, `Вас пригласил @${ctx.user.username}!`, [['Отлично!']]);
            await ctx.redirectFor(maybeInvitedUser, 'root->root');
        }

        await ctx.send('Пользователь успешно приглашен!\nВозможно пригласим кого-то ещё?');
    }
}
