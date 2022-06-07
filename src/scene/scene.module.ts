import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SceneMessage } from './entity/message.entity';
import { SceneStory } from './entity/story.entity';
import { SceneSubmit } from './entity/submit.entity';
import { SceneService } from './scene.service';
import { SceneController } from './scene.controller';
import { SceneVisit } from './entity/visit.entity';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from 'src/web3/web3.module';
import { Badge } from './entity/badge.entity';
import { IpfsModule } from 'src/ipfs/ipfs.module';

@Module({
  imports: [
    ConfigModule,
    Web3Module,
    IpfsModule,
    TypeOrmModule.forFeature([
      SceneMessage,
      SceneSubmit,
      SceneStory,
      SceneVisit,
      Badge,
    ]),
  ],
  providers: [SceneService],
  controllers: [SceneController],
})
export class SceneModule {}
