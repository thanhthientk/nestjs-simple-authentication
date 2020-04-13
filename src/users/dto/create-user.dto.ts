import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsPhoneNumber
} from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber('VN')
  readonly phone: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  readonly password: string;

  @IsString()
  @MaxLength(30)
  readonly fullName: string;
}
