import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Journal } from './journal.entity';
import { Token } from './token.entity';
import { TokensService } from './tokens.service';
import { User } from './user.entity';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

class RepositoryMock {
  create(): void {}
  async save(): Promise<void> {}
}

describe('AppController', () => {
  let appController: AppController;
  let usersRepository: Repository<User>;
  let tokensRepository: Repository<Token>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        UsersService,
        TokensService,
        { provide: getRepositoryToken(User), useClass: RepositoryMock },
        { provide: getRepositoryToken(Token), useClass: RepositoryMock },
        { provide: getRepositoryToken(Journal), useClass: RepositoryMock },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    tokensRepository = module.get<Repository<Token>>(getRepositoryToken(Token));
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('register', () => {
    it('should throw an bad request', () => {
      const userDTO: UserDTO = {
        firstName: undefined,
        lastName: undefined,
      };

      async function registerUser() {
        await appController.registerUser(userDTO);
      }

      return expect(registerUser).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should create a user', () => {
      const user: User = {
        id: null,
        firstName: 'Flavien',
        lastName: 'Schriever',
        isActive: true,
      };
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce(user);

      const token: Partial<Token> = {
        hash: 'helloworld',
      };
      jest
        .spyOn(tokensRepository, 'save')
        .mockResolvedValueOnce(token as Token);

      return expect(appController.registerUser(user)).resolves.toStrictEqual({
        token: token.hash,
      });
    });
  });
});
