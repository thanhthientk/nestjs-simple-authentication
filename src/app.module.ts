import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config.module';

import { UsersModule } from './users/users.module';
import { ConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.getMongoUri(),
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      }),
      inject: [ConfigService]
    }),
    UsersModule
  ]
})
export class AppModule {}
