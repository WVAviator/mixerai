import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateVoteDto {
  @IsString({
    message: 'Vote must be a string',
  })
  @IsEnum(['like', 'dislike'], {
    message: 'Vote must be either "like" or "dislike"',
  })
  @IsNotEmpty({
    message: 'Vote must not be empty',
  })
  vote: 'like' | 'dislike';
}
