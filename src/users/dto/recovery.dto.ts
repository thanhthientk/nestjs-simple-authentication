import { IsPhoneNumber } from 'class-validator';

export class RecoveryDto {
  @IsPhoneNumber('VN')
  phone: string;
}
