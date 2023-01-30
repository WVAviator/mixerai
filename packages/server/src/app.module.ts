import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GenerateModule } from './generate/generate.module';
import { ImageModule } from './image/image.module';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RecipeModule,
    UserModule,
    AuthModule,
    GenerateModule,
    ImageModule,
    OpenAIModule,
  ],
})
export class AppModule {}
