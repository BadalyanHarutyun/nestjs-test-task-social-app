import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { IUserRepository } from './interfaces/user-repository.interface';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from './entities/user.entity';
import { RegisterResponseDto } from './dto/register-response.dto';
import { ConfigService } from '@nestjs/config';
import { AppConfig, AuthConfig } from '../config/config.interface';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async register(createAuthDto: RegisterAuthDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findByEmail(
      createAuthDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const authConfig = this.configService.get<AuthConfig>('auth')!;
    const saltRounds = authConfig.bcryptSaltRounds;
    const hashedPassword = await bcrypt.hash(
      createAuthDto.password,
      saltRounds,
    );

    const userToCreate: RegisterAuthDto = {
      ...createAuthDto,
      password: hashedPassword,
    };

    const newUser = await this.userRepository.create(userToCreate);
    if (!newUser) {
      throw new ConflictException('Failed to create user');
    }
    return { message: 'Register successful' };
  }

  async login(loginDto: LoginAuthDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id };
    const authConfig = this.configService.get<AuthConfig>('auth')!;
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: authConfig.jwtExpiresIn as StringValue,
      }),
    };
  }
  async findUser(id: number): Promise<Omit<User, 'password'> | null> {
    return this.userRepository.findById(id);
  }
}
