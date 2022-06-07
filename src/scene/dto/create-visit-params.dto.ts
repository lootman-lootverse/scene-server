import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVisitParms {
  @ApiProperty()
  @IsString()
  scene: string;
  @ApiProperty()
  @IsString()
  url: string;
  @ApiProperty()
  @IsString()
  account: string;
}
