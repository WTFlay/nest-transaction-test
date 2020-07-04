export class RepositoryMock {
  create<T>(entity: T): T {
    return entity;
  }
  async save<T>(entity: T): Promise<T> {
    return entity;
  }
}

export class TransactionalRepositoryMock {
  public static count = 0;

  getRepository(): RepositoryMock {
    TransactionalRepositoryMock.count++;
    return new RepositoryMock();
  }
}
