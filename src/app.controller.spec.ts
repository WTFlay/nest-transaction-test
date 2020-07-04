import { BadRequestException } from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensService } from './tokens.service';
import { TransactionModuleMock } from './transaction/transaction-mock.module';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

describe('AppController', () => {
  let appController: AppController;
  let tokensService: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TransactionModuleMock],
      controllers: [AppController],
      providers: [AppService, UsersService, TokensService],
    }).compile();

    appController = module.get<AppController>(AppController);
    tokensService = module.get<TokensService>(TokensService);
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

    it('should create a user', async () => {
      const userDTO: UserDTO = {
        firstName: 'Flavien',
        lastName: 'Schriever',
      };

      const { token } = await appController.registerUser(userDTO);
      expect(token).toBe(
        tokensService.generateDigest([userDTO.firstName, userDTO.lastName]),
      );
    });
  });
});
