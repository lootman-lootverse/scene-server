import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpfsService } from 'src/ipfs/ipfs.service';
import { PageParams, PageResult } from 'src/utils/page';
import { Connection, Repository } from 'typeorm';
import { BadgeStatusDTO } from './dto/badge-status.dto';
import { CreateMessageParams } from './dto/create-message-params.dto';
import { CreateStoryParams } from './dto/create-story-params.dto';
import { CreateSubmitParams } from './dto/create-submit-params.dto';
import { CreateVisitParms } from './dto/create-visit-params.dto';
import { Badge } from './entity/badge.entity';
import { SceneMessage } from './entity/message.entity';
import { SceneStory } from './entity/story.entity';
import { SceneSubmit } from './entity/submit.entity';
import { SceneVisit } from './entity/visit.entity';

@Injectable()
export class SceneService {
  logger = new Logger(SceneService.name);

  constructor(
    private readonly connection: Connection,

    @InjectRepository(SceneMessage)
    private readonly messageRepo: Repository<SceneMessage>,

    @InjectRepository(SceneSubmit)
    private readonly submitRepo: Repository<SceneSubmit>,

    @InjectRepository(SceneStory)
    private readonly storyRepo: Repository<SceneStory>,

    @InjectRepository(SceneVisit)
    private readonly visitRepo: Repository<SceneVisit>,

    @InjectRepository(Badge)
    private readonly badgeRepo: Repository<Badge>,

    private readonly ipfs: IpfsService,
  ) {}

  async querySubmit(opts: {
    scene: string;
    account: string;
  }): Promise<SceneSubmit | undefined> {
    return await this.submitRepo.findOne({
      scene: opts.scene,
      account: opts.account,
    });
  }

  async createSubmit(opts: CreateSubmitParams): Promise<SceneSubmit> {
    const obj = await this.connection.transaction(async (entityManager) => {
      const repo = entityManager.getRepository(SceneSubmit);
      let obj = await repo.findOne({
        where: { scene: opts.scene, account: opts.account },
        lock: { mode: 'pessimistic_write' },
      });
      if (obj) {
        await repo.delete(obj);
      }
      obj = repo.create({
        ...opts,
      });
      await repo.save(obj);

      // 创建Badge
      const badgeRepo = entityManager.getRepository(Badge);
      const badgeObj = await badgeRepo.findOne({
        owner: opts.account.toLowerCase(),
        scene: opts.scene,
      });
      if (!badgeObj) {
        await badgeRepo.save(
          badgeRepo.create({
            owner: opts.account.toLowerCase(),
            scene: opts.scene,
          }),
        );
      }
      // END
      return obj;
    });

    return obj;
  }

  async queryMessages(opts: {
    scene: string;
    page: PageParams;
  }): Promise<PageResult<SceneMessage>> {
    const [messages, total] = await this.messageRepo.findAndCount({
      where: { scene: opts.scene },
      order: { id: 'DESC' },
      skip: opts.page.skip,
      take: opts.page.take,
    });
    return PageResult.from(opts.page, messages, total);
  }

  async createMessage(opts: CreateMessageParams): Promise<SceneMessage> {
    const obj = this.messageRepo.create({ ...opts });
    await this.messageRepo.save(obj);
    return obj;
  }

  async queryStory(opts: {
    account: string;
    scene: string;
  }): Promise<SceneStory | undefined> {
    return await this.storyRepo.findOne({
      account: opts.account,
      scene: opts.scene,
    });
  }

  async createStory(opts: CreateStoryParams): Promise<SceneStory> {
    return await this.connection.transaction(async (entityManager) => {
      const repo = entityManager.getRepository(SceneStory);
      let obj = await repo.findOne({
        where: { scene: opts.scene, account: opts.account },
        lock: { mode: 'pessimistic_write' },
      });
      if (obj) {
        await repo.delete(obj);
      }
      obj = repo.create(opts);

      // 上传至IPFS网络
      const ipfsContent =
        `Discord Tag\n${obj.discordTag}\n\n` +
        `Address\n${obj.account}\n\n` +
        `Story name\n${obj.name}\n\n` +
        `Story outline\n${obj.summary}\n\n` +
        `Details of the case\n${obj.case}\n\n` +
        `Details of the clues and props\n${obj.clueProps}\n\n` +
        `Dialogues of NPCs\n${obj.npcDialogue}\n\n` +
        `More details\n${obj.more}\n\n`;
      const { Hash } = await this.ipfs.add({ content: ipfsContent });
      obj.ipfsCid = Hash;
      await repo.save(obj);
      return obj;
    });
  }

  async createVisit(opts: CreateVisitParms): Promise<SceneVisit> {
    const obj = this.visitRepo.create(opts);
    return await this.visitRepo.save(obj);
  }

  async listBadgeStatus(opts: {
    address: string;
    scenes: string[];
  }): Promise<BadgeStatusDTO[]> {
    const address = opts.address.toLowerCase();

    return await Promise.all(
      opts.scenes.map(async (scene) => {
        const badge = await this.badgeRepo.findOne({
          owner: address,
          scene: scene,
        });
        return {
          scene: scene,
          status: badge ? (badge.claimed ? 'claimed' : 'got') : 'not-got',
        };
      }),
    );
  }

  async claimBadge(opts: { address: string; scene: string }): Promise<void> {
    await this.connection.transaction(async (entityManager) => {
      const repo = entityManager.getRepository(Badge);
      const obj = await repo.findOne({
        scene: opts.scene,
        owner: opts.address.toLowerCase(),
      });
      if (obj && !obj.claimed) {
        obj.claimed = true;
        await repo.save(obj);
      }
    });
  }
}
