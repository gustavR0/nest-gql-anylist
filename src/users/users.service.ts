import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from './../auth/dto/inputs/signup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string) {
    return `This action removes a #${id} user`;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
