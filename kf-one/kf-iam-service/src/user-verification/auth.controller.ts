import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Logs in a user with email and password.',
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
    status: 200,
    description: 'User logged in successfully.'
  })
    
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
