import { ApiProperty } from '@nestjs/swagger';

/** Public user shape returned by auth endpoints. Never carries secrets. */
export class SafeUserResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'sara@example.com' })
  email!: string;

  @ApiProperty({ example: 'Sara', nullable: true })
  name!: string | null;

  @ApiProperty({ example: 'Customer', enum: ['Admin', 'Operator', 'Customer'] })
  role!: string;

  @ApiProperty({ example: 7, nullable: true })
  operatorId!: number | null;

  @ApiProperty({ example: true })
  emailVerified!: boolean;

  @ApiProperty({ example: true })
  isActive!: boolean;
}

/** Issued session: identity plus both tokens. */
export class AuthSessionResponse {
  @ApiProperty({ type: SafeUserResponse })
  user!: SafeUserResponse;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken!: string;

  @ApiProperty({ description: 'Opaque refresh token, single use (rotated).' })
  refreshToken!: string;
}
