import { Module } from '@nestjs/common';
import { TfaService } from './tfa.service';
import { SmsService, RedisService } from '../services';

@Module({
  providers: [TfaService, SmsService, RedisService],
  exports: [TfaService]
})
export class TfaModule {}
