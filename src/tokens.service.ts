import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as crypto from 'crypto';

import { Journal } from './journal.entity';
import { Token } from './token.entity';
import { User } from './user.entity';

export class TokensService {
  constructor(
    @InjectRepository(Token) private tokensRepository: Repository<Token>,
    @InjectRepository(Journal) private journalsRepository: Repository<Journal>,
  ) {}

  async generate(user: User): Promise<Token> {
    if (!user || user.firstName == null || user.lastName == null) {
      throw new Error('User need a firstName and lastName');
    }

    const hash = crypto.createHash('md5');
    hash.update(user.firstName);
    hash.update(user.lastName);
    hash.update(Date.now().toString());
    const digest = hash.digest('hex');

    const token = this.tokensRepository.create({
      hash: digest,
      user,
    });

    const savedToken = await this.tokensRepository.save(token);

    await this.journalsRepository.save({
      token: savedToken,
    });

    return savedToken;
  }
}
