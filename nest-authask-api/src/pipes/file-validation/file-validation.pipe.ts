import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File required', HttpStatus.BAD_REQUEST);
    }

    const isImage = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/gif',
    ].includes(file.mimetype);

    if (!isImage) {
      throw new HttpException(
        'File type must be: png, jpg, jpeg or gif',
        HttpStatus.BAD_REQUEST,
      );
    }

    const sizeLimit = file.size <= 1024 * 1024 * 10; // 10Mb
    if (!sizeLimit) {
      throw new HttpException(
        'File size must be less than 10MB',
        HttpStatus.BAD_REQUEST,
      );
    }

    return file;
  }
}
