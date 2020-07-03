import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

class UserRepositoryMock {
  create(): void {}
  async save(): Promise<void> {}
}

describe('AppController', () => {
  let appController: AppController;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        UsersService,
        { provide: getRepositoryToken(User), useClass: UserRepositoryMock },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
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
      const user: User = {
        id: null,
        firstName: 'Flavien',
        lastName: 'Schriever',
        isActive: true,
      };

      jest.spyOn(usersRepository, 'create').mockReturnValue(user);
      const saveUser = jest.spyOn(usersRepository, 'save');
      await appController.registerUser(user);
      expect(saveUser).toBeCalledWith(user);
    });
  });
});
