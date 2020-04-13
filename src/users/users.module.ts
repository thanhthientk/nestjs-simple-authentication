import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersSchema } from './model/users.schema';
import { UsersService } from './users.service';
import { TfaModule } from '../common/tfa';
import { BcryptService, JwtService } from '../common/services';

@Module({
  imports: [
    TfaModule,
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService, BcryptService, JwtService]
})
export class UsersModule {}
