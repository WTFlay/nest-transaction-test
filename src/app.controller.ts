import {
  Controller,
  Get,
  HttpCode,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';

import { AppService } from './app.service';
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
  @HttpCode(204)
  async registerUser(@Body() userDTO: UserDTO) {
    try {
      await this.usersService.register(userDTO.firstName, userDTO.lastName);
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
