import { ApiProperty } from '@nestjs/swagger';

export class ResponseData<T> {
  @ApiProperty()
  code: number;
  @ApiProperty()
  msg: string;
  data: T;
}
