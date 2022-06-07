import { ApiProperty } from '@nestjs/swagger';
import { ENTITY_ACCOUNT_LENGTH } from 'src/const';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SceneStory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 64 })
  scene: string;

  @Column({ nullable: false, length: 2048 })
  url: string;

  @ApiProperty({ description: '提交账户' })
  @Column({ length: ENTITY_ACCOUNT_LENGTH })
  account: string;

  @ApiProperty({ description: 'Discord号' })
  @Column({ length: 64 })
  discordTag: string;

  @ApiProperty({ description: '故事名' })
  @Column({ length: 64 })
  name: string;

  @ApiProperty({ description: '故事摘要' })
  @Column({ type: 'text' })
  summary: string;

  @ApiProperty({ description: '案件还原' })
  @Column({ type: 'text' })
  case: string;

  @ApiProperty({ description: '线索道具使用' })
  @Column({ type: 'text' })
  clueProps: string;

  @ApiProperty({ description: 'NPC对话' })
  @Column({ type: 'text' })
  npcDialogue: string;

  @ApiProperty({ description: '更多内容' })
  @Column({ type: 'text' })
  more: string;

  @ApiProperty({ description: 'IPFS Cid' })
  @Column({ default: '', comment: 'ipfs cid' })
  ipfsCid: string;

  @CreateDateColumn()
  createTime: Date;
}
