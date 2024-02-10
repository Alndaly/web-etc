import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.server';

@Module({
    controllers: [FileController],
    providers: [FileService]
})
export class FileModule { }
