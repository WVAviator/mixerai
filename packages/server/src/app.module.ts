import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GenerateModule } from './generate/generate.module';
import { ImageModule } from './image/image.module';
import { OpenAIModule } from './openai/openai.module';
import { VoteModule } from './vote/vote.module';
import { AuthSessionModule } from './auth-session/auth-session.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(4000),
        MONGODB_URI: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        COOKIE_SECRET: Joi.string().required(),
        OPENAI_SECRET_KEY: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        MONGODB_DB: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        await ConfigModule.envVariablesLoaded;
        console.log('URI:', configService.get('MONGODB_URI'));
        return {
          uri: configService.get('MONGODB_URI'),
          dbName: configService.get('MONGODB_DB'),
        };
      },
      inject: [ConfigService],
    }),
    RecipeModule,
    UserModule,
    AuthModule,
    GenerateModule,
    ImageModule,
    OpenAIModule,
    VoteModule,
    AuthSessionModule,
  ],
})
export class AppModule {}
