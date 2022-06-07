import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class SigData<D> {
  @ApiProperty()
  @IsNotEmpty()
  timestamp: number;
  @ApiProperty()
  @IsNotEmpty()
  address: string;
  @ApiProperty()
  @IsNotEmpty()
  rawdata: D;
}

export class DataWithSig<D> {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  data: SigData<D>;

  @ApiProperty()
  @IsNotEmpty()
  sig: string;
}
