import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from './entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { RegisterResponseDto } from './dto/register-response.dto';
import { ConflictException } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    type: ConflictException,
    example: {
      statusCode: 409,
      message: 'User already exists',
      error: 'Conflict',
    },
  })
  async register(
    @Body() createAuthDto: RegisterAuthDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Login Unauthorized',
    type: UnauthorizedException,
    example: {
      statusCode: 401,
      message: 'Invalid credentials',
      error: 'Unauthorized',
    },
  })
  async login(@Body() loginDto: LoginAuthDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
    },
  })
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
