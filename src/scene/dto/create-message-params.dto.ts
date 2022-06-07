import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageParams {
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
  message: string;
}
