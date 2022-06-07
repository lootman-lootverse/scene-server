import { ENTITY_ACCOUNT_LENGTH } from 'src/const';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SceneVisit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 64 })
  scene: string;

  @Column({ nullable: false, length: 2048 })
  url: string;

  @Column({ nullable: false, length: ENTITY_ACCOUNT_LENGTH })
  account: string;

  @CreateDateColumn()
  createTime: Date;
}
