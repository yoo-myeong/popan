import { LoggingModule } from './logging/logging.module';
import { ExceptionModule } from './exception/exception.module';
import { AuthService } from './auth/auth.service';
import { validationSchema } from './config/validationSchema';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/authConfig';
import emailConfig from './config/emailConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    AuthModule,
    ExceptionModule,
    LoggingModule,
    TerminusModule,
    HttpModule,

    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'popan',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
    }),
  ],
  controllers: [AppController, HealthCheckController],
  providers: [AppService, EmailService, AuthService, HealthCheckController],
})
export class AppModule {}
