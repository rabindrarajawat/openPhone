
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationEntity } from 'src/entities/notification.entity';
@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;
  notifyNewEvent(notification: NotificationEntity) {
    this.server.emit('newNotification', notification);
  }
}  

