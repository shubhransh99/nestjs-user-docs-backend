import { IsEmail, IsString, MinLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Alice Johnson',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'alice@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for user account (min 6 characters)',
    example: 'securePass123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role ID assigned to the user',
    example: 2,
  })
  @IsInt()
  role_id: number;
}
