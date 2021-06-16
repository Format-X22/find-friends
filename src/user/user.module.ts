import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDefinition, UserSchema } from './user.schema';

@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: UserDefinition.name, schema: UserSchema }])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
