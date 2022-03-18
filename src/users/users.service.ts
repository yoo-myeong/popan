import { UserInfo } from './UserInfo';
import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async create(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email: string) {
    return false;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    throw new Error('함수 구현 계획');
  }

  async login(email: string, password: string): Promise<string> {
    throw new Error('함수 구현 계획');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('함수 구현 계획');
  }
}
