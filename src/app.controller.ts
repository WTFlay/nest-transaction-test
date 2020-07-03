import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';

import { AppService } from './app.service';
import { TokenDTO } from './token.dto';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/register')
  async registerUser(@Body() userDTO: UserDTO): Promise<TokenDTO> {
    try {
      const token = await this.usersService.register(
        userDTO.firstName,
        userDTO.lastName,
      );
      return { token: token.hash };
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
