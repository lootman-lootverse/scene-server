import { ApiProperty } from '@nestjs/swagger';
import { ENTITY_ACCOUNT_LENGTH } from 'src/const';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SceneMessage {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 64 })
  scene: string;

  @Column({ nullable: false, length: 2048 })
  url: string;

  @ApiProperty()
  @Column({ nullable: false, length: ENTITY_ACCOUNT_LENGTH })
  account: string;

  @ApiProperty()
  @Column({ nullable: false, length: 800 })
  message: string;

  @ApiProperty()
  @CreateDateColumn()
  createTime: Date;
}
