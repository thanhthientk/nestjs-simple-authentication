import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @IsNotEmpty()
  tfaId: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
