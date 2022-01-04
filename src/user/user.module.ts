import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';

@Global()
@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
