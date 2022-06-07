import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataWithSig, SigData } from 'src/dto/data-with-sig.dto';
import { ResponseData } from 'src/dto/response-data.dto';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
import { VerifyEthSignPipe } from 'src/pipes/verify-eth-sign.pipe';
import { PageParams, PageResult } from 'src/utils/page';
import {
  schemaWithEthSig,
  withPageResultWrap,
  withResponseDataWrap,
} from 'src/utils/schema';
import { BadgeStatusDTO } from './dto/badge-status.dto';
import { ClaimBadgeParams } from './dto/claim-badge-params.dto';
import { CreateMessageParams } from './dto/create-message-params.dto';
import { CreateStoryParams } from './dto/create-story-params.dto';
import { CreateSubmitParams } from './dto/create-submit-params.dto';
import { CreateVisitParms } from './dto/create-visit-params.dto';
import { QuerySelfSubmitsParams } from './dto/query-self-submits-params.dto';
import { SceneMessage } from './entity/message.entity';
import { SceneStory } from './entity/story.entity';
import { SceneSubmit } from './entity/submit.entity';
import { SceneService } from './scene.service';

@Controller('scenes')
@UseInterceptors(TransformInterceptor)
@ApiTags('Scene')
@ApiExtraModels(
  ResponseData,
  PageResult,
  DataWithSig,
  SigData,

  SceneSubmit,
  SceneMessage,
  SceneStory,

  CreateSubmitParams,
  CreateMessageParams,
  CreateStoryParams,
  CreateVisitParms,
  QuerySelfSubmitsParams,

  ClaimBadgeParams,
  BadgeStatusDTO,
)
export class SceneController {
  constructor(private readonly sceneService: SceneService) {}

  @Post('submits')
  @ApiOperation({ summary: '提交解谜' })
  @ApiBody({ schema: schemaWithEthSig({ model: CreateSubmitParams }) })
  @ApiResponse({
    status: 200,
    schema: withResponseDataWrap({ model: SceneSubmit }),
  })
  async createSubmit(
    @Body(VerifyEthSignPipe)
    { address, rawdata }: SigData<CreateSubmitParams>,
  ): Promise<SceneSubmit> {
    return await this.sceneService.createSubmit({
      ...rawdata,
      account: address,
    });
  }

  @Post('submits/self')
  @ApiOperation({ summary: '查看我已提交的解谜, 不存在则返回null' })
  @ApiBody({ schema: schemaWithEthSig({ model: QuerySelfSubmitsParams }) })
  @ApiResponse({
    status: 200,
    schema: withResponseDataWrap({ model: SceneSubmit }),
  })
  async querySubmit(
    @Body(VerifyEthSignPipe)
    { address, rawdata }: SigData<QuerySelfSubmitsParams>,
  ): Promise<SceneSubmit | undefined> {
    return (
      (await this.sceneService.querySubmit({
        scene: rawdata.scene,
        account: address,
      })) || null
    );
  }

  @Post('messages')
  @ApiOperation({ summary: '提交留言' })
  @ApiBody({ schema: schemaWithEthSig({ model: CreateMessageParams }) })
  @ApiResponse({
    status: 200,
    schema: withResponseDataWrap({ model: SceneMessage }),
  })
  async createMessage(
    @Body(VerifyEthSignPipe)
    body: SigData<CreateMessageParams>,
  ): Promise<SceneMessage> {
    return await this.sceneService.createMessage({
      ...body.rawdata,
    });
  }

  @Get('messages')
  @ApiOperation({ summary: '查看留言' })
  @ApiResponse({
    status: 200,
    schema: withResponseDataWrap({
      schema: withPageResultWrap({ model: SceneMessage }),
    }),
  })
  async queryMessages(
    @Query('scene') scene: string,
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe('10'), ParseIntPipe) size: number,
  ): Promise<PageResult<SceneMessage>> {
    return await this.sceneService.queryMessages({
      scene,
      page: new PageParams({ page, size }),
    });
  }

  @Post('stories')
  @ApiOperation({ summary: '提交故事' })
  @ApiBody({ schema: schemaWithEthSig({ model: CreateStoryParams }) })
  @ApiResponse({
    status: 200,
    schema: withResponseDataWrap({ model: SceneStory }),
  })
  async createStory(
    @Body(VerifyEthSignPipe)
    body: SigData<CreateStoryParams>,
  ): Promise<SceneStory> {
    return await this.sceneService.createStory({
      ...body.rawdata,
      account: body.address,
    });
  }

  @Get('stories')
  @ApiOperation({ summary: '查看我提交的故事' })
  @ApiResponse({
    status: 200,
    schema: withResponseDataWrap({ model: SceneStory }),
  })
  async queryStory(
    @Query('account') account: string,
    @Query('scene') scene: string,
  ): Promise<SceneStory | undefined> {
    return (await this.sceneService.queryStory({ scene, account })) || null;
  }

  @Post('visits')
  @ApiOperation({ summary: '访问记录' })
  async creatVist(@Body(ValidationPipe) body: CreateVisitParms) {
    return await this.sceneService.createVisit(body);
  }

  @Get('badges')
  @ApiOperation({ summary: '查看勋章' })
  @ApiResponse({
    status: 200,
    schema: withResponseDataWrap({ model: BadgeStatusDTO, isArray: true }),
  })
  async listBadgeStatus(
    @Query('addr') addr: string,
    @Query('scenes') scenes: string,
  ): Promise<BadgeStatusDTO[]> {
    const scenes_ = (scenes || '')
      .split(',')
      .map((v) => v.trim())
      .filter((v) => !!v);
    return await this.sceneService.listBadgeStatus({
      address: addr.toLowerCase(),
      scenes: scenes_,
    });
  }

  @Post('claim-badges')
  @ApiOperation({ summary: '领取勋章' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    schema: schemaWithEthSig({ model: ClaimBadgeParams }),
  })
  async claimBadge(
    @Body(VerifyEthSignPipe) data: SigData<ClaimBadgeParams>,
  ): Promise<void> {
    await this.sceneService.claimBadge({
      address: data.address,
      scene: data.rawdata.scene,
    });
  }
}
