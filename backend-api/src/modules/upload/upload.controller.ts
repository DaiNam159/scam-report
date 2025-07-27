import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinary } from './cloudinary.config';
import { Readable } from 'stream';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const bufferStream = Readable.from(file.buffer);
    console.log('cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('api_key:', process.env.CLOUDINARY_API_KEY);
    console.log('api_secret:', process.env.CLOUDINARY_API_SECRET);
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'evidence',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      bufferStream.pipe(uploadStream);
    });

    return { url: result.secure_url };
  }
}
