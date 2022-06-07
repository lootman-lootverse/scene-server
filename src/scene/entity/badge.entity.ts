import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique('uq_addr_badge', ['owner', 'scene'])
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  scene: string;

  @Column({ length: 64 })
  owner: string;

  @Column({ default: false })
  claimed: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
