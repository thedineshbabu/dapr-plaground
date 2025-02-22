import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVerification } from './user-verification.entity';
import { UserVerificationService } from './user-verification.service';
import { UserVerificationController } from './user-verification.controller';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserVerification])],
  providers: [UserVerificationService, AuthService],
  controllers: [UserVerificationController, AuthController],
})
export class UserVerificationModule {}
