import { InternalServerErrorException } from '@nestjs/common';

/**
 * Exception thrown when an image upload from a remote url to S3 bucket fails.
 */
export class ImageUploadException extends InternalServerErrorException {}
