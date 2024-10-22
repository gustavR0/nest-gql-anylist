import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from './../users/users.service';
import { SignupInput, LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private getToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    // TODO: crear usuairo
    const user = await this.usersService.create(signupInput);

    // Todo: crear JWT
    const token = this.getToken(user.id);

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Email / Password do not match');

    //Todo: token implementation
    const token = this.getToken(user.id);

    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive) throw new UnauthorizedException('User is inactive');

    delete user.password;

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getToken(user.id);
    return {
      token,
      user,
    };
  }
}
