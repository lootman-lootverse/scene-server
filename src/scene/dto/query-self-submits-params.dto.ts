import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class QuerySelfSubmitsParams {
  @ApiProperty()
  @IsString()
  scene: string;
  @ApiProperty()
  @IsString()
  account: string;
}
