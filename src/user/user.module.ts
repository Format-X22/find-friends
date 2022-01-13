import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ModelsModule } from '../models/models.module';

@Global()
@Module({
    imports: [ModelsModule],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
