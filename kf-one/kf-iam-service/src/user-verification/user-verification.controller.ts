import { Controller, Post, Body } from '@nestjs/common';
import { UserVerificationService } from './user-verification.service';
import { SendOtpDto } from './dto/sendotp.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';

@Controller('user-verification')
export class UserVerificationController {
  constructor(private userVerificationService: UserVerificationService) {}

  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.userVerificationService.sendOtp(dto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.userVerificationService.verifyOtp(dto);
  }
}
