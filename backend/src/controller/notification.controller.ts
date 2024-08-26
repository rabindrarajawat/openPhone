// import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
// import { NotificationService } from '../service/notification.service';
// import { AuthGuard } from 'src/authguard/auth.guard';

// @Controller('notifications')
// @UseGuards(AuthGuard)
// export class NotificationController {
//   constructor(private notificationService: NotificationService) {}

//   @Post(':eventId')
//   async createNotification(@Param('eventId') eventId: number) {
//     return this.notificationService.createNotification(eventId);
//   }

//   @Get()
//   async getUnreadNotifications() {
//     return this.notificationService.getUnreadNotifications();
//   }

//   @Post(':notificationId/read')
//   async markNotificationAsRead(@Param('notificationId') notificationId: number) {
//     await this.notificationService.markNotificationAsRead(notificationId);
//     return { message: 'Notification marked as read' };
//   }
// }

import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  InternalServerErrorException,
} from "@nestjs/common";
import { NotificationService } from "../service/notification.service";
import { AuthGuard } from "../authguard/auth.guard";

@Controller("notifications")
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post(":eventId")
  async createNotification(@Param("eventId") eventId: number) {
    try {
      return await this.notificationService.createNotification(eventId);
    } catch (error) {
      console.error("Error in createNotification:", error);
      throw new InternalServerErrorException("Failed to create notification");
    }
  }

  @Get()
  async getUnreadNotifications() {
    try {
      return await this.notificationService.getUnreadNotifications();
    } catch (error) {
      console.error("Error in getUnreadNotifications:", error);
      throw new InternalServerErrorException(
        "Failed to get unread notifications"
      );
    }
  }

  @Post(":notificationId/read")
  async markNotificationAsRead(
    @Param("notificationId") notificationId: number
  ) {
    try {
      await this.notificationService.markNotificationAsRead(notificationId);
      return { message: "Notification marked as read" };
    } catch (error) {
      console.error("Error in markNotificationAsRead:", error);
      throw new InternalServerErrorException(
        "Failed to mark notification as read"
      );
    }
  }
}
