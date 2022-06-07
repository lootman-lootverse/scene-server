import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubmitParams {
  @ApiProperty()
  @IsString()
  account: string;
  @ApiProperty()
  @IsString()
  url: string;
  @ApiProperty()
  @IsString()
  scene: string;
  @ApiProperty()
  @IsString()
  lang: string;
  @ApiProperty()
  @IsString()
  answer: string;
  @ApiProperty()
  @IsString()
  reason: string;
  @ApiProperty()
  @IsString()
  discordTag: string;
  @ApiProperty()
  @IsString()
  community: string;
}
