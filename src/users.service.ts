import { Injectable } from '@nestjs/common';

import { Token } from './token.entity';
import { TokensService } from './tokens.service';
import { TransactionalRepository } from './transaction/transactional-repository.provider';
import { UnitOfWork } from './transaction/unit-of-work.provider';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    private unitOfWork: UnitOfWork,
    private repository: TransactionalRepository,
    private readonly tokensService: TokensService,
  ) {}

  get usersRepository() {
    return this.repository.getRepository(User);
  }

  async register(firstName: string, lastName: string): Promise<Token> {
    if (!firstName || !lastName) {
      throw new Error('Missing first name or last name');
    }

    const user = this.usersRepository.create({
      firstName,
      lastName,
    });

    return this.unitOfWork.withTransaction(async () => {
      const savedUser = await this.usersRepository.save(user);
      const token = await this.tokensService.generate(savedUser);
      return token;
    });
  }
}
