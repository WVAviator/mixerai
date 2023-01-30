import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../user/schemas/user.schema';
import { User } from '../user/user.decorator';
import { CreateVoteDto } from './dtos/create-vote.dto';
import { UpdateVoteDto } from './dtos/update-vote.dto';
import { VoteService } from './vote.service';

@Controller('vote')
export class VoteController {
  constructor(private voteService: VoteService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getVote(@Param('id') recipeId, @User() user: UserDocument) {
    return this.voteService.getVote({ recipeId, user });
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  createVote(
    @Body() { vote }: CreateVoteDto,
    @Param('id') recipeId,
    @User() user: UserDocument,
  ) {
    return this.voteService.createVote({ recipeId, vote, user });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateVote(
    @Body() { vote }: UpdateVoteDto,
    @Param('id') recipeId,
    @User() user: UserDocument,
  ) {
    return this.voteService.updateVote({ recipeId, vote, user });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteVote(@Param('id') recipeId, @User() user: UserDocument) {
    return this.voteService.deleteVote({ recipeId, user });
  }
}
