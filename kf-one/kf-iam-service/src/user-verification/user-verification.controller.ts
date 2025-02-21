import { Controller, Post, Body } from '@nestjs/common';
import { UserVerificationService } from './user-verification.service';
import { SendOtpDto } from './dto/sendotp.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user-verification')
export class UserVerificationController {
  constructor(private userVerificationService: UserVerificationService) {}

  @Post('send-otp')
  @ApiOperation({
    summary: 'Send OTP to the user',
    description: 'Sends an OTP to the user for verification.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully.',
    type: SendOtpDto
  })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.userVerificationService.sendOtp(dto);
  }


  @ApiOperation({
    summary: 'Verify OTP for the user',
    description: 'Verifies the OTP provided by the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully.',
    type: VerifyOtpDto
  })
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.userVerificationService.verifyOtp(dto);
  }
}
