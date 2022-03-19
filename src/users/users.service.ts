import { AuthService } from './../auth/auth.service';
import { UserEntity } from './entities/user.entity';
import { UserInfo } from './UserInfo';
import * as uuid from 'uuid';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    private authService: AuthService,
    private connection: Connection,

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email: string) {
    const user = await this.usersRepository.findOne({ email });

    return user !== undefined;
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({ signupVerifyToken });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({ email, password });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.usersRepository.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
