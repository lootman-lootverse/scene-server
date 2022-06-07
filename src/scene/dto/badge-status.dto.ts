import { ApiProperty } from '@nestjs/swagger';

export class BadgeStatusDTO {
  @ApiProperty({})
  scene: string;

  @ApiProperty({ type: 'enum', enum: ['got', 'not-got', 'claimed'] })
  status: 'got' | 'not-got' | 'claimed';
}
