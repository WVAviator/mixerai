import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({
    message: 'AUID must be a string.',
  })
  @IsNotEmpty({
    message: 'AUID must not be empty.',
  })
  auid: string;
}
