import { ApiProperty } from '@nestjs/swagger';
import { ENTITY_ACCOUNT_LENGTH } from 'src/const';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SceneSubmit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 64 })
  scene: string;

  @Column({ nullable: false, length: 2048 })
  url: string;

  @Column({ nullable: false, default: 'en' })
  lang: string;

  @ApiProperty()
  @Column({ nullable: false, length: 64 })
  discordTag: string;

  @ApiProperty()
  @Column({ nullable: false, length: ENTITY_ACCOUNT_LENGTH })
  account: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  answer: string;
  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  reason: string;
  @ApiProperty()
  @Column({ nullable: false, length: 100, default: '' })
  community: string;

  @CreateDateColumn()
  createTime: Date;
}
