export class UnitOfWorkMock {
  getTransactionManager(): void {}
  getConnection(): void {}
  async withTransaction<T>(work: () => T): Promise<T> {
    return work();
  }
}
