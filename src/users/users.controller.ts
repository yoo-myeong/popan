import { AuthGuard } from './../auth.guard';
import { AuthService } from './../auth/auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-eamil';
import { Controller, Get, Post, Body, Param, Query, Headers, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInfo } from './UserInfo';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private authService: AuthService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.create(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
  }
}
