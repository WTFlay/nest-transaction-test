import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';

import { Token } from './token.entity';

@Entity()
export class Journal {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Token, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  token: Token;

  @Column()
  tokenId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
