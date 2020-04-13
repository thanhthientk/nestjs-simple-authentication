import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(value, salt);
  }

  async compare(value, hashed): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}
