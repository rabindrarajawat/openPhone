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
  Query,
} from "@nestjs/common";
import { NotificationService } from "../service/notification.service";
import { AuthGuard } from "../authguard/auth.guard";
import { CustomLogger } from "src/service/logger.service";

@Controller("notifications")
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService,
    private readonly logger: CustomLogger
  ) { }
 
  @Post(":eventId")
  async createNotification(@Param("eventId") eventId: number) {
    try {
      const result = await this.notificationService.createNotification(eventId);
      this.logger.log(`Notification created successfully for eventId=${eventId}`); // Log success response
      return result;
    } catch (error) {
      this.logger.error('Error in createNotification:', error.message); // Log error details
      console.error('Error in createNotification:', error); // Optional: Log to console for debugging
      throw new InternalServerErrorException('Failed to create notification');
    }
  }


  @Get()
  async getUnreadNotifications() {
    try {
      const notifications = await this.notificationService.getUnreadNotifications();
      this.logger.log(`Retrieved ${notifications.length} unread notifications successfully`); // Log success response
      return notifications;
    } catch (error) {
      this.logger.error('Error in getUnreadNotifications:', error.message); // Log error details
      console.error('Error in getUnreadNotifications:', error); // Optional: Log to console for debugging
      throw new InternalServerErrorException('Failed to get unread notifications');
    }
  }
  @Post(":notificationId/read")
  async markNotificationAsRead(
    @Param("notificationId") notificationId: number,
    @Query("addressId") addressId?: number
  ) {
    try {
      await this.notificationService.markNotificationAsRead(notificationId, addressId);
      this.logger.log(`Notification with ID=${notificationId} marked as read${addressId ? ` for addressId=${addressId}` : ''}`); // Log success response
      return { message: "Notification marked as read" };
    } catch (error) {
      this.logger.error('Error in markNotificationAsRead:', error.message); // Log error details
      console.error('Error in markNotificationAsRead:', error); // Optional: Log to console for debugging
      throw new InternalServerErrorException('Failed to mark notification as read');
    }
  }

}
