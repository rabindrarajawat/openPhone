import { Controller, Post, Get, Param } from '@nestjs/common';
import { NotificationService } from '../service/notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post(':eventId')
  async createNotification(@Param('eventId') eventId: number) {
    return this.notificationService.createNotification(eventId);
  }

  @Get()
  async getUnreadNotifications() {
    return this.notificationService.getUnreadNotifications();
  }

  @Post(':notificationId/read')
  async markNotificationAsRead(@Param('notificationId') notificationId: number) {
    await this.notificationService.markNotificationAsRead(notificationId);
    return { message: 'Notification marked as read' };
  }
}