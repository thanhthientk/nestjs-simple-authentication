import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { ConfigService } from '../../config.service';

@Injectable()
export class SmsService {
  private readonly client;
  constructor(private readonly config: ConfigService) {
    const { accountSid, authToken } = this.config.getTwilioConfig();
    this.client = twilio(accountSid, authToken);
  }
  async tSend(to: string, message: string): Promise<any> {
    const { phoneNumber: from } = this.config.getTwilioConfig();
    return this.client.messages.create({
      body: message,
      from,
      to
    });
  }

  async send(to: string, message: string): Promise<boolean> {
    // tslint:disable-next-line:no-console
    console.log(message);
    return new Promise(resolve => resolve(true));
  }
}
