import { Controller, Post, Body } from '@nestjs/common';
import { UserVerificationService } from './user-verification.service';
import { SendOtpDto } from './dto/sendotp.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user-verification')
export class UserVerificationController {
  constructor(private userVerificationService: UserVerificationService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Registers a new user with the provided details.',
    })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'Email address of the user' },
          password: { type: 'string', description: 'Password for the user account' }
        },
        required: ['email', 'password']
      }
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.'
  })
  async registerUser(@Body() body: { email: string; password: string }) {
    console.log('Incoming request body:', JSON.stringify(body)); // Debugging
    return this.userVerificationService.registerUser(body.email, body.password);
  }

  
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
