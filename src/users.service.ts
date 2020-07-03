import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  register(firstName: string, lastName: string): Promise<User> {
    if (!firstName || !lastName) {
      throw new Error('Missing first name or last name');
    }

    const user = this.usersRepository.create({
      firstName,
      lastName,
    });

    return this.usersRepository.save(user);
  }
}
