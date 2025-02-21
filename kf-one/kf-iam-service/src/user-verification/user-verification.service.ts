import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserVerification } from './user-verification.entity';
import { SendOtpDto } from './dto/sendotp.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserVerificationService {
  constructor(
    @InjectRepository(UserVerification)
    private userVerificationRepo: Repository<UserVerification>,
  ) {}

  async sendOtp(dto: SendOtpDto): Promise<string> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);

    let user = await this.userVerificationRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      user = this.userVerificationRepo.create({ email: dto.email, otp, otp_expires_at: otpExpiresAt });
    } else {
      user.otp = otp;
      user.otp_expires_at = otpExpiresAt;
    }

    await this.userVerificationRepo.save(user);
    await this.sendEmail(dto.email, otp);

    return 'OTP sent successfully!';
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<string> {
    const user = await this.userVerificationRepo.findOne({
      where: { email: dto.email, otp: dto.otp },
    });

    if (!user || user.otp_expires_at < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    user.is_verified = true;
    user.otp = null;
    user.otp_expires_at = null;

    await this.userVerificationRepo.save(user);
    return 'OTP verified successfully!';
  }

  private async sendEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    await transporter.sendMail({
      from: '"OTP Verification" <no-reply@yourapp.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
    });
  }
}
