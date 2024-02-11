import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class FileService {
    async saveFile(file): Promise<string> {
        const filePath = join(__dirname, '..', '..', 'static', file.originalname);
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, file.buffer, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(`static/${file.originalname}`)
                }
            });
        });
    }
}
