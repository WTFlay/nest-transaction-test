import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Journal } from './journal.entity';
import { Token } from './token.entity';
import { TokensService } from './tokens.service';
import { TransactionModule } from './transaction/transaction.module';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 32768,
      username: 'root',
      password: 'root',
      database: 'database',
      entities: [User, Token, Journal],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Token, Journal]),
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, TokensService],
})
export class AppModule {}
