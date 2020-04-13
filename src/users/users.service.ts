import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from './model/users.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  LoginDto,
  CreateUserDto,
  ConfirmTfaDto,
  RecoveryDto,
  SetNewPasswordDto
} from './dto';

import { ConfigService } from '../config.service';
import { TfaService } from '../common/tfa';
import { BcryptService, JwtService } from '../common/services';
import { phoneFormat } from '../common/utils';

import {
  userNotFound,
  wrongPassword,
  accountBlocked
} from '../common/constants/errors.constant';

interface LoginTransformed {
  email?: string;
  phone?: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') readonly userModel: Model<Users>,
    private readonly config: ConfigService,
    private readonly tfaService: TfaService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService
  ) {}

  async create(user: CreateUserDto): Promise<Users> {
    const password = await this.bcryptService.hash(user.password);
    const newUser = new this.userModel({
      ...user,
      phone: phoneFormat(user.phone),
      password
    });
    return newUser.save();
  }

  async login({
    email,
    phone,
    password
  }: LoginDto & LoginTransformed): Promise<any> {
    const query = email ? { email } : { phone };
    const user = await this.userModel.findOne(query);
    if (!user) {
      throw new BadRequestException(userNotFound);
    }

    const isPasswordMatch = await this.bcryptService.compare(
      password,
      user.password
    );
    if (!isPasswordMatch) {
      throw new BadRequestException(wrongPassword);
    }
    if (user.isBlocked) {
      throw new BadRequestException(accountBlocked);
    }

    if (this.config.isTFAEnabled()) {
      const tfa = await this.tfaService.sign({
        type: 'login',
        phone: user.phone,
        data: { userId: user.id }
      });
      return {
        isTfaEnabled: true,
        tfaId: tfa.id,
        user: { phone: '*** *** ' + user.phone.slice(-3) }
      };
    }

    const accessToken = await this.jwtService.sign({ user: user.id });
    return {
      isTfaEnabled: false,
      accessToken
    };
  }

  async confirmLoginTfa({ tfaId, code }: ConfirmTfaDto) {
    const tfa = await this.tfaService.verify(tfaId, code, true);
    if (tfa.type !== 'login') {
      throw new BadRequestException();
    }

    const accessToken = await this.jwtService.sign({ user: tfa.data.userId });
    return {
      accessToken
    };
  }

  async recoveryUserAccount({ phone }: RecoveryDto) {
    const user = await this.userModel.findOne({ phone: phoneFormat(phone) });

    if (!user) {
      throw new BadRequestException(userNotFound);
    }
    if (user.isBlocked) {
      throw new BadRequestException(accountBlocked);
    }

    const tfa = await this.tfaService.sign({
      type: 'recovery',
      phone: user.phone,
      data: { userId: user.id }
    });

    return {
      tfaId: tfa.id,
      user: { phone: user.phone }
    };
  }

  async confirmRecoveryTfa({ tfaId, code }: ConfirmTfaDto) {
    const tfa = await this.tfaService.verify(tfaId, code);
    if (tfa.type !== 'recovery') {
      throw new BadRequestException();
    }
    return {
      isCodeValid: true
    };
  }

  async setNewPassword({
    tfaId,
    code,
    password,
    confirmPassword
  }: SetNewPasswordDto) {
    if (password !== confirmPassword) {
      throw new BadRequestException('Confirmation password is not matched');
    }
    const tfa = await this.tfaService.verify(tfaId, code, true);
    if (tfa.type !== 'recovery') {
      throw new BadRequestException();
    }

    const userId = tfa.data.userId;
    const newPasswordHashed = await this.bcryptService.hash(password);
    await this.userModel.findByIdAndUpdate(userId, {
      password: newPasswordHashed
    });

    const accessToken = await this.jwtService.sign({ user: userId });
    return {
      accessToken
    };
  }
}
