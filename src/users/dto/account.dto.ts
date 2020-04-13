import { IsEmail, IsPhoneNumber } from 'class-validator';

export class AccountDto {
  @IsPhoneNumber('VN')
  phone: string;
  @IsEmail()
  email: string;
}
