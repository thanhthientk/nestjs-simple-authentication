import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AccountDto, LoginDto } from './dto';
import { userNotFound } from '../common/constants/errors.constant';
import { phoneFormat } from '../common/utils';

@Injectable()
export class LoginTransformPipe implements PipeTransform {
  async transform({ username, password }: LoginDto) {
    const account: AccountDto = {
      phone: username,
      email: username
    };

    const object = plainToClass(AccountDto, account);
    const errors = await validate(object);

    if (errors.length >= 2) {
      throw new BadRequestException(userNotFound);
    }

    if (errors[0].property === 'phone') {
      return {
        email: username,
        password
      };
    } else {
      return {
        phone: phoneFormat(username),
        password
      };
    }
  }
}
