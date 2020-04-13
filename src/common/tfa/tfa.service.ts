import { BadRequestException, Injectable } from '@nestjs/common';
import { SmsService } from '../services/sms.service';
import { RedisService } from '../services/redis.service';
import * as uuid4 from 'uuid/v4';
import * as randomNumber from 'random-number-csprng';
import {
  tfaNotFoundOrExpired,
  wrongTfaCode
} from '../constants/errors.constant';

interface TfaDto {
  type: 'login' | 'recovery' | 'transaction';
  data: any;
  phone: string;
}
interface Tfa extends TfaDto {
  id: string;
  code: string;
}

@Injectable()
export class TfaService {
  constructor(
    private readonly smsService: SmsService,
    private readonly redisService: RedisService
  ) {}

  async sign({ type, data, phone }: TfaDto): Promise<Tfa> {
    const id = uuid4();
    const code = await randomNumber(10000, 99999);
    const message = `Ma xac nhan tai khoan cua ban tai Aguland la: ${code}`;
    await this.smsService.send(phone, message);

    const tfa = {
      type,
      data,
      phone,
      code
    };
    await this.redisService.set(id, JSON.stringify(tfa));

    return { ...tfa, id };
  }

  async verify(
    tfaId: string,
    code: string,
    destroy: boolean = false
  ): Promise<Tfa> {
    const tfaString = await this.redisService.get(tfaId);
    if (!tfaString) {
      throw new BadRequestException(tfaNotFoundOrExpired);
    }

    const tfa: Tfa = JSON.parse(tfaString);
    if (String(tfa.code) !== String(code)) {
      throw new BadRequestException(wrongTfaCode);
    }

    if (destroy) {
      await this.redisService.del(tfaId);
    }

    return tfa;
  }
}
