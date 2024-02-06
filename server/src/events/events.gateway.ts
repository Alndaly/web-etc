import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { v4 as uuidV4 } from 'uuid';
import { Server, Socket } from 'socket.io';

const rooms: Record<string, any[]> = {};

interface IRoomParams {
  roomId: string;
  peerId: string;
}

interface IJoinRoomParams extends IRoomParams {
  userName: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['POST', 'GET'],
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection() {
    console.log('user connected');
  }

  handleDisconnect() {
    console.log('user disconnected');
  }

  leaveRoom({ roomId, peerId }: IRoomParams) {
    rooms[roomId] = rooms[roomId].filter(id => id !== peerId);
    this.server.to(roomId).emit('user-disconnected', { peerId })
    this.server.emit('get-users', {
      roomId: roomId,
      participants: rooms[roomId]
    })
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: IJoinRoomParams) {
    if (!rooms[data.roomId]) rooms[data.roomId] = [];
    console.log(`user join the room ${data.roomId} ${data.peerId}`);
    rooms[data.roomId].push(data.peerId)
    client.join(data.roomId)
    this.server.to(data.roomId).emit('user-joined', { peerId: data.peerId })
    this.server.emit('get-users', {
      roomId: data.roomId,
      participants: rooms[data.roomId]
    })
    client.on('disconnect', () => {
      console.log(`user leave the room`);
      this.leaveRoom({ roomId: data.roomId, peerId: data.peerId });
    })
  }

  @SubscribeMessage('create-room')
  handleCreateRoom(@ConnectedSocket() client: Socket) {
    const roomId = uuidV4();
    rooms[roomId] = [];
    client.emit('room-created', { roomId });
    console.log('user created the room');
  }
}
