import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'antwan_rowe71@gmail.com',
    description: 'Registered email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
    description: 'Plaintext password of the user',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
