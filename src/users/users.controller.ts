import { UserLoginDto } from './dto/userLogin.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<void> {
    console.log(dto);
    return;
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    return;
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    console.log(dto);
    return;
  }

  @Get(':id')
  findOne(@Param('id') userId: string) {
    console.log(userId);
    return;
  }
}
