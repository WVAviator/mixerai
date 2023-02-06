import { Module } from '@nestjs/common';
import { AuthSessionService } from './auth-session.service';
import { AuthSessionSchema } from './schemas/auth-session.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AuthSession', schema: AuthSessionSchema },
    ]),
  ],
  providers: [AuthSessionService],
  exports: [AuthSessionService],
})
export class AuthSessionModule {}
