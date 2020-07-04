import { Module, Global } from '@nestjs/common';

import { TransactionalRepository } from './transactional-repository.provider';
import { UnitOfWork } from './unit-of-work.provider';

@Global()
@Module({
  providers: [UnitOfWork, TransactionalRepository],
  exports: [UnitOfWork, TransactionalRepository],
})
export class TransactionModule {}
