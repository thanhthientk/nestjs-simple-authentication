import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class IsMongoIdPipe implements PipeTransform {
  transform(value: string, { type, data }: ArgumentMetadata): string {
    if (
      type === 'param' &&
      data === 'id' &&
      !mongoose.Types.ObjectId.isValid(value)
    ) {
      throw new BadRequestException('Invalid Mongo ID');
    }

    return value;
  }
}
