import {
  Body,
  Controller,
  Delete,
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
    console.log('File uploaded successfully:', result);
    return { url: result.secure_url, public_id: result.public_id };
  }

  @Delete()
  async deleteFile(@Body() body: { public_id: string }) {
    const { public_id } = body;

    try {
      const result = await cloudinary.uploader.destroy(public_id);
      return { message: 'Deleted', result };
    } catch (err) {
      console.error('Error deleting file:', err);
      throw new Error('Unable to delete file.');
    }
  }
}
