import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginTransformPipe } from './login-transform.pipe';

import {
  LoginDto,
  RecoveryDto,
  CreateUserDto,
  ConfirmTfaDto,
  SetNewPasswordDto
} from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Post('/login')
  async login(@Body(new LoginTransformPipe()) account: LoginDto) {
    return this.usersService.login(account);
  }

  @Post('/login/tfa')
  async confirmLoginTfa(@Body() body: ConfirmTfaDto) {
    return this.usersService.confirmLoginTfa(body);
  }

  @Post('/recovery')
  async recovery(@Body() body: RecoveryDto) {
    return this.usersService.recoveryUserAccount(body);
  }

  @Post('/recovery/tfa')
  async confirmRecoveryTfa(@Body() body: ConfirmTfaDto) {
    return this.usersService.confirmRecoveryTfa(body);
  }

  @Post('/recovery/set-new-password')
  async setNewPassword(@Body() body: SetNewPasswordDto) {
    return this.usersService.setNewPassword(body);
  }
}
