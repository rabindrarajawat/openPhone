// // // notification.service.ts
// import { Injectable, NotFoundException, Logger } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { NotificationEntity } from "../entities/notification.entity";
// import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
// import { NotificationGateway } from "../gateways/notification.gateway";

// @Injectable()
// export class NotificationService {
//   private readonly logger = new Logger(NotificationService.name);
//   constructor(
//     @InjectRepository(NotificationEntity)
//     private notificationRepository: Repository<NotificationEntity>,
//     @InjectRepository(OpenPhoneEventEntity)
//     private eventRepository: Repository<OpenPhoneEventEntity>,
//     private notificationGateway: NotificationGateway
//   ) {}

//   async createNotification(eventId: number): Promise<NotificationEntity> {
//     const event = await this.eventRepository.findOne({
//       where: { id: eventId },
//     });

//     if (!event) {
//       throw new NotFoundException("Event not found");
//     }

//     const openPhoneEvent = await this.eventRepository.findOne({
//       where: { conversation_id: event.conversation_id },
//       order: { created_at: "ASC" },
//     });

//     const notification = this.notificationRepository.create({
//       event_id: eventId,
//       address_id: openPhoneEvent?.address_id,
//     });

//     const savedNotification =
//       await this.notificationRepository.save(notification);
//     this.notificationGateway.notifyNewEvent(savedNotification);

//     return savedNotification;
//   }
//   async getUnreadNotifications(): Promise<NotificationEntity[]> {
//     return this.notificationRepository.find({
//       where: { is_read: false },
//       relations: ["event"],
//       order: { created_at: "DESC" },
//     });
//   }

//   async markNotificationAsRead(notificationId: number): Promise<void> {
//     const notification = await this.notificationRepository.findOne({
//       where: { event_id: notificationId },
//     });
//     if (!notification) {
//       return;
//     }

//     notification.is_read = true;

//     try {
//       const result = await this.notificationRepository.save(notification);
//     } catch (error) {}
//   }
// }

import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationEntity } from "../entities/notification.entity";
import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
import { NotificationGateway } from "../gateways/notification.gateway";

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(OpenPhoneEventEntity)
    private eventRepository: Repository<OpenPhoneEventEntity>,
    private notificationGateway: NotificationGateway
  ) { }



  async createNotification(eventId: number): Promise<NotificationEntity> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });

      if (!event) {
        throw new NotFoundException("Event not found");
      }

      const openPhoneEvent = await this.eventRepository.findOne({
        where: { conversation_id: event.conversation_id },
        order: { created_at: "ASC" },
      });

      const notification = this.notificationRepository.create({
        event_id: eventId,
        address_id: openPhoneEvent?.address_id,
      });

      const savedNotification =
        await this.notificationRepository.save(notification);
      this.notificationGateway.notifyNewEvent(savedNotification);

      return savedNotification;
    } catch (error) {
      this.logger.error(
        `Error in createNotification: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException("Failed to create notification");
    }
  }

  // async getUnreadNotificationss(): Promise<NotificationEntity[]> {
  //   try {
  //     return this.notificationRepository.find({
  //       where: { is_read: false },
  //       relations: ["event"],
  //       order: { created_at: "DESC" },
  //     });
  //   } catch (error) {
  //     this.logger.error(
  //       `Error in getUnreadNotifications: ${error.message}`,
  //       error.stack
  //     );
  //     throw new InternalServerErrorException(
  //       "Failed to get unread notifications"
  //     );
  //   }
  // }

 
  // async getUnreadNotificationCountByAddress(): Promise<{ addressId: number; unreadCount: number }[]> {
  //   try {
  //     const unreadCounts = await this.notificationRepository
  //       .createQueryBuilder('notification')
  //       .select('notification.address_id', 'addressId')
  //       .addSelect('COUNT(notification.id)', 'unreadCount')
  //       .where('notification.is_read = :isRead', { isRead: false })
  //       .groupBy('notification.address_id')
  //       .getRawMany();

  //     return unreadCounts.map((result) => ({
  //       addressId: parseInt(result.addressId, 10),
  //       unreadCount: parseInt(result.unreadCount, 10),
  //     }));
  //   } catch (error) {
  //     this.logger.error(`Error in getUnreadNotificationCountByAddress: ${error.message}`, error.stack);
  //     throw new InternalServerErrorException('Failed to get unread notification counts by address');
  //   }
  // }


  async getUnreadNotificationCountByAddress(
    page: number,
    limit: number,
  ): Promise<{
    message: string;
    data: Array<{
      addressId: number;
      unreadCount: number;
    }>;
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;
  
      // Fetch total count of unread notifications
      const totalCount = await this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.is_read = :isRead', { isRead: false })
        .getCount();
  
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);
  
      // Fetch paginated unread counts
      const rawData = await this.notificationRepository
        .createQueryBuilder('notification')
        .select('notification.address_id', 'addressId')
        .addSelect('COUNT(notification.id)', 'unreadCount')
        .where('notification.is_read = :isRead', { isRead: false })
        .groupBy('notification.address_id')
        .offset(offset)
        .limit(limit)
        .getRawMany();
  
      // Map raw data to desired structure
      const data = rawData.map((item) => ({
        addressId: parseInt(item.addressId, 10),
        unreadCount: parseInt(item.unreadCount, 10),
      }));
  
      // Return structured response
      return {
        message: 'Success',
        data,
        totalCount,
        currentPage: page,
        totalPages,
      };
    } catch (error) {
      this.logger.error(
        `Error in getUnreadNotificationCountByAddress: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get unread notification counts by address',
      );
    }
  }
  
  
  
  async getUnreadNotificationCount(): Promise<number> {
    return await this.notificationRepository.count({
      where: { is_read: false }
    });
  }

  async getUnreadNotifications(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
  
    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { is_read: false },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
      relations: ['event'],  // Load the 'event' relationship
    });
  
    const hasMore = total > page * limit;
  
    return {
      notifications,
      hasMore
    };
  }
  

  async markNotificationAsRead(notificationId: number, addressId?: number): Promise<void> {
    try {
      let notifications;

      if (addressId) {
        // When addressId is provided, update all notifications with the given addressId
        notifications = await this.notificationRepository.find({
          where: { address_id: addressId },
        });
      } else {
        // Otherwise, find notification by eventId
        notifications = await this.notificationRepository.find({
          where: { event_id: notificationId },
        });
      }

      if (!notifications.length) {
        return; // No notifications to update
      }

      // Set all found notifications as read
      for (const notification of notifications) {
        notification.is_read = true;
      }

      await this.notificationRepository.save(notifications);
    } catch (error) {
      this.logger.error(
        `Error in markNotificationAsRead: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        "Failed to mark notification as read"
      );
    }
  }

}
