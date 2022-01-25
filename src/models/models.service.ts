import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './definition/user.model';
import { Invite } from './definition/invite.model';
import { Quest, QuestRequest } from './definition/quest.model';

@Injectable()
export class ModelsService {
    constructor(
        @InjectModel(User) public userModel: typeof User,
        @InjectModel(Invite) public inviteModel: typeof Invite,
        @InjectModel(Quest) public questModel: typeof Quest,
        @InjectModel(QuestRequest) public questRequestModel: typeof QuestRequest,
    ) {}
}
