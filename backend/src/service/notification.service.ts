// // notification.service.ts
import { Injectable, NotFoundException, Logger } from "@nestjs/common";
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
  ) {}

  async createNotification(eventId: number): Promise<NotificationEntity> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    const notification = this.notificationRepository.create({
      event_id: eventId,
      address_id: event.address_id,
    });
    const savedNotification =
      await this.notificationRepository.save(notification);
    this.notificationGateway.notifyNewEvent(savedNotification);
    return savedNotification;
  }

  async getUnreadNotifications(): Promise<NotificationEntity[]> {
    return this.notificationRepository.find({
      where: { is_read: false },
      relations: ["event"],
      order: { created_at: "DESC" },
    });
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { event_id: notificationId },
    });
    if (!notification) {
      return;
    }

    notification.is_read = true;

    try {
      const result = await this.notificationRepository.save(notification);
    } catch (error) {}
  }
}
