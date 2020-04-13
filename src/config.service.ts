import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

interface Config {
  NODE_ENV: 'development' | 'staging' | 'production';
  REDIS_URI: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  IS_TFA_ENABLED: boolean;
  TW_SID: string;
  TW_TOKEN: string;
  TW_PN: string;
}

@Injectable()
export class ConfigService {
  private readonly config: Config;
  constructor() {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    this.config = ConfigService.validateEnv(envConfig);
  }

  private static validateEnv(config) {
    const envSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'staging', 'production'])
        .default('development'),
      JWT_SECRET: Joi.string().length(36),
      IS_TFA_ENABLED: Joi.boolean().default(true),
      REDIS_URI: Joi.string().required(),
      MONGO_URI: Joi.string().required(),
      TW_SID: Joi.string().required(),
      TW_TOKEN: Joi.string().required(),
      TW_PN: Joi.string().required(),
    });

    const { error, value: validateConfig } = Joi.validate(config, envSchema);
    if (error) {
      throw new Error(`Config Error: ${error.message}`);
    }

    return validateConfig;
  }

  isTFAEnabled(): boolean {
    return this.config.IS_TFA_ENABLED;
  }

  getRedisConfig() {
    return this.config.REDIS_URI;
  }

  getTwilioConfig() {
    return {
      accountSid: this.config.TW_SID,
      authToken: this.config.TW_TOKEN,
      phoneNumber: this.config.TW_PN
    };
  }

  getJwtConfig() {
    return {
      secret: this.config.JWT_SECRET
    };
  }

  getMongoUri() {
    return this.config.MONGO_URI;
  }
}
