import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserVerification } from './user-verification.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserVerification)
    private readonly userRepo: Repository<UserVerification>,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.is_locked) {
      throw new ForbiddenException('Account is locked due to multiple failed login attempts');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      user.failed_attempts += 1;

      if (user.failed_attempts >= 3) {
        user.is_locked = true;
      }

      await this.userRepo.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    user.failed_attempts = 0;
    await this.userRepo.save(user);

    // Generate and return JWT Token (Replace with actual implementation)
    return 'JWT_TOKEN';
  }
}
