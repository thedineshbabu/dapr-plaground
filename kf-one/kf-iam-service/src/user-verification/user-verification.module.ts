import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVerification } from './user-verification.entity';
import { UserVerificationService } from './user-verification.service';
import { UserVerificationController } from './user-verification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserVerification])],
  providers: [UserVerificationService],
  controllers: [UserVerificationController],
})
export class UserVerificationModule {}
