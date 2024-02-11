import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventModule } from './events/event.module';
import { FileModule } from './file/file.module';
import { RoomController } from './room/room.controller';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    EventModule,
    FileModule,
    RoomModule
  ],
})
export class AppModule { }
