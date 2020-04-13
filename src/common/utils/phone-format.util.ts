import { PhoneNumberUtil } from 'google-libphonenumber';
const phoneUtil = PhoneNumberUtil.getInstance();

export function phoneFormat(phone: string, countryCode: string = 'VN') {
  const phoneNumber = phoneUtil.parseAndKeepRawInput(phone, countryCode);
  return phoneUtil.format(phoneNumber, 0);
}
