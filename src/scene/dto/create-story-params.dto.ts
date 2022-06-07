import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoryParams {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  account: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  scene: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  case: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clueProps: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  discordTag: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  more: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  npcDialogue: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  summary: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}
