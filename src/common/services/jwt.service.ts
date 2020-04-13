import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config.service';

@Injectable()
export class JwtService {
  private readonly jwtConfig;
  constructor(private readonly config: ConfigService) {
    this.jwtConfig = this.config.getJwtConfig();
  }

  async sign(data: object): Promise<any> {
    return jwt.sign(data, this.jwtConfig.secret, { expiresIn: '7 days' });
  }

  async verify(token: string): Promise<any> {
    // verify token
  }
}
