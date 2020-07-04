import { Module } from '@nestjs/common';

import { TransactionalRepository } from './transactional-repository.provider';
import { TransactionalRepositoryMock } from './transactional-repository.mock';
import { UnitOfWork } from './unit-of-work.provider';
import { UnitOfWorkMock } from './unit-of-work.mock';

@Module({
  providers: [
    { provide: UnitOfWork, useClass: UnitOfWorkMock },
    { provide: TransactionalRepository, useClass: TransactionalRepositoryMock },
  ],
  exports: [UnitOfWork, TransactionalRepository],
})
export class TransactionModuleMock {}
