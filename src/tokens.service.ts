import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';

import { Journal } from './journal.entity';
import { Token } from './token.entity';
import { TransactionalRepository } from './transaction/transactional-repository.provider';
import { User } from './user.entity';

@Injectable()
export class TokensService {
  constructor(private repository: TransactionalRepository) {}

  get journalsRepository() {
    return this.repository.getRepository(Journal);
  }

  get tokensRepository() {
    return this.repository.getRepository(Token);
  }

  generateDigest(words: string[]): string {
    const hash = crypto.createHash('md5');
    words.forEach(word => {
      hash.update(word);
    });
    return hash.digest('hex');
  }

  async generate(user: User): Promise<Token> {
    if (!user || user.firstName == null || user.lastName == null) {
      throw new Error('User need a firstName and lastName');
    }

    const digest = this.generateDigest([user.firstName, user.lastName]);
    const token = this.tokensRepository.create({
      hash: digest,
      user,
    });

    const savedToken = await this.tokensRepository.save(token);
    const journal = this.journalsRepository.create({ token: savedToken });
    await this.journalsRepository.save(journal);

    return savedToken;
  }
}
