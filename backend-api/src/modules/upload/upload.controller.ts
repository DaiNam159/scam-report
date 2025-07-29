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
