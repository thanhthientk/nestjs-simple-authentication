import { IsNotEmpty } from 'class-validator';

export class ConfirmTfaDto {
  @IsNotEmpty()
  tfaId: string;

  @IsNotEmpty()
  code: string;
}
