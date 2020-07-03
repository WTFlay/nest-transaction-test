import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Token } from './token.entity';
import { TokensService } from './tokens.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly tokensService: TokensService,
  ) {}

  async register(firstName: string, lastName: string): Promise<Token> {
    if (!firstName || !lastName) {
      throw new Error('Missing first name or last name');
    }

    const user = this.usersRepository.create({
      firstName,
      lastName,
    });

    const savedUser = await this.usersRepository.save(user);

    const token = await this.tokensService.generate(savedUser);

    return token;
  }
}
