import { promisify } from 'util';
import * as redis from 'redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config.service';

@Injectable()
export class RedisService {
  get;
  set;
  del;
  private readonly client;
  constructor(private readonly config: ConfigService) {
    this.client = redis.createClient(config.getRedisConfig());
    this.set = promisify(this.client.set).bind(this.client);
    this.get = promisify(this.client.get).bind(this.client);
    this.del = promisify(this.client.del).bind(this.client);
  }
}
