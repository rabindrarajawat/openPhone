import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, ILike, Repository } from "typeorm";
import { AddressDto } from "../dto/address.dto";
import { AddressEntity } from "../entities/address.entity";
import { OpenPhoneEventEntity } from "src/entities/open-phone-event.entity";
import * as moment from "moment";
import { NotificationEntity } from "src/entities/notification.entity";
interface Event {
  id: number;
  event_type_id: number;
  event_direction_id: number;
  body: string;
  created_at: string;
}
export interface AddressWithConversations
  extends Omit<AddressEntity, "events"> {
  events: OpenPhoneEventEntity[];
  conversation_ids: string[];
}

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @InjectRepository(OpenPhoneEventEntity)
    private openPhoneEventRepository: Repository<OpenPhoneEventEntity>
  ) {}
  @InjectRepository(NotificationEntity)
  private notificatonRepository: Repository<NotificationEntity>



  async createAddress(addressDto: {
    address: string;
    date: Date;
    auction_event_id: number;
  }) {
    try {
      const address = this.addressRepository.create({
        address: addressDto.address,
        date: addressDto.date,
        created_by: "Admin",
        is_active: true,
        auction_event_id: addressDto.auction_event_id,
      });

      return await this.addressRepository.save(address);
    } catch (error) {
      console.error("Error saving address:", error);
      throw new InternalServerErrorException("Error saving address");
    }
  }

  //with recieved and delivered
  async findAll(
    page: number = 1,
    limit: number = 10,
    auctionEventIds?: number[],
    filterType?: string,
    fromDate?: string,
    toDate?: string,
    withResponses?: boolean,
    withStopResponses?: boolean,
    sortBy: string = "modified_at",
    sortOrder: "ASC" | "DESC" = "DESC",
    isBookmarked?: boolean,
    searchTerm?: string,
    eventTypeIds?: number[]
  ): Promise<{ data: Array<{ address: AddressEntity; unreadCount: number }>; totalCount: number }> {
    try {
      const queryBuilder = this.addressRepository
        .createQueryBuilder("address")
        .leftJoinAndSelect("address.events", "event")
        .where("address.is_active = :isActive", { isActive: true });
  
      // Handle multiple auction event IDs
      if (auctionEventIds && auctionEventIds.length > 0) {
        queryBuilder.andWhere(
          "address.auction_event_id IN (:...auctionEventIds)",
          { auctionEventIds }
        );
      }
  
      // Handle eventTypeIds filter
      if (eventTypeIds && eventTypeIds.length > 0) {
        queryBuilder.andWhere((qb) => {
          const conversationsSubQuery = qb
            .subQuery()
            .select("DISTINCT(e.conversation_id)")
            .from(OpenPhoneEventEntity, "e")
            .where(
              new Brackets((sqb) => {
                if (eventTypeIds.includes(1)) {
                  sqb.orWhere(
                    "(e.event_type_id = :receivedTypeId AND e.event_direction_id = :incomingDirection)"
                  );
                }
                if (eventTypeIds.includes(2)) {
                  sqb.orWhere(
                    "(e.event_type_id = :deliveredTypeId AND e.event_direction_id = :outgoingDirection)"
                  );
                }
              })
            )
            .getQuery();
  
          const addressSubQuery = qb
            .subQuery()
            .select("DISTINCT(e2.address_id)")
            .from(OpenPhoneEventEntity, "e2")
            .where(`e2.conversation_id IN (${conversationsSubQuery})`)
            .getQuery();
  
          return "address.id IN " + addressSubQuery;
        })
          .setParameter("receivedTypeId", 1)
          .setParameter("deliveredTypeId", 2)
          .setParameter("incomingDirection", 1)
          .setParameter("outgoingDirection", 2);
      }
  
      // Apply filterType (weekly/monthly)
      if (filterType === "weekly") {
        const startOfWeek = moment().startOf("week").toDate();
        const endOfWeek = moment().endOf("week").toDate();
        queryBuilder.andWhere(
          "address.created_at BETWEEN :startOfWeek AND :endOfWeek",
          { startOfWeek, endOfWeek }
        );
      } else if (filterType === "monthly") {
        const startOfMonth = moment().startOf("month").toDate();
        const endOfMonth = moment().endOf("month").toDate();
        queryBuilder.andWhere(
          "address.created_at BETWEEN :startOfMonth AND :endOfMonth",
          { startOfMonth, endOfMonth }
        );
      }
  
      // Apply date range filter
      if (fromDate && toDate) {
        const startDate = moment(fromDate).startOf("day").toDate();
        const endDate = moment(toDate).endOf("day").toDate();
        queryBuilder.andWhere(
          "address.created_at BETWEEN :startDate AND :endDate",
          { startDate, endDate }
        );
      }
  
      // Handle withResponses filter
      if (withResponses) {
        queryBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select("DISTINCT(e1.address_id)")
            .from(OpenPhoneEventEntity, "e1")
            .innerJoin(
              OpenPhoneEventEntity,
              "e2",
              "e1.conversation_id = e2.conversation_id"
            )
            .where("e1.event_direction_id = :incomingDirection", {
              incomingDirection: 2,
            })
            .andWhere("e2.event_direction_id = :outgoingDirection", {
              outgoingDirection: 1,
            })
            .getQuery();
          return "address.id IN " + subQuery;
        });
      }
      if (withStopResponses) {
      queryBuilder.andWhere((qb) => {
      // Subquery to find conversation IDs with 'Stop' messages or is_stop marked as true
      const conversationWithStopSubQuery = qb
      .subQuery()
      .select("DISTINCT(e.conversation_id)")
      .from(OpenPhoneEventEntity, "e")
      .where("(e.body = :stopMessage OR e.is_stop = :isStop)")
      .getQuery();
      
      // Subquery to find address IDs associated with the conversations found above
      const addressWithStopSubQuery = qb
      .subQuery()
      .select("DISTINCT(e2.address_id)")
      .from(OpenPhoneEventEntity, "e2")
      .where(`e2.conversation_id IN (${conversationWithStopSubQuery})`)
      .andWhere("e2.address_id IS NOT NULL") // Ensure we only select non-NULL address IDs
      .getQuery();
      
      // Filter the main query by address IDs found in the above subquery
      return "address.id IN " + addressWithStopSubQuery;
      });
      
      // Set parameters for filtering by stop message and is_stop flag
      queryBuilder
      .setParameter("stopMessage", "Stop")
      .setParameter("isStop", true);
      }
      



  
      // Handle search term
      if (searchTerm) {
        queryBuilder.andWhere(
          "address.address ILIKE :searchTerm",
          { searchTerm: `%${searchTerm}%` }
        );
      }
  
      // Handle bookmarked addresses
      if (isBookmarked !== undefined) {
        queryBuilder.andWhere("address.is_bookmarked = :isBookmarked", {
          isBookmarked,
        });
      }
  
      // Sorting
      queryBuilder.orderBy(`address.${sortBy}`, sortOrder);
  
      // Pagination
      queryBuilder.skip((page - 1) * limit).take(limit);
  
      // Get data and unread count
      const addresses = await queryBuilder.getMany();
      const totalCount = await queryBuilder.getCount();
  
      // Calculate unreadCount for each address
      const data = await Promise.all(
        addresses.map(async (address) => {
          const unreadCount = await this.notificatonRepository
            .createQueryBuilder("event")
            .where("event.address_id = :addressId", { addressId: address.id })
            .andWhere("event.is_read = false")
            .getCount();
  
          return { address, unreadCount };
        })
      );
  
      return { data, totalCount };
    } catch (error) {
      console.error("Error finding all addresses:", error);
      throw new InternalServerErrorException("Error finding all addresses");
    }
  }
  
  
  

  // async findAll(
  //   page: number = 1,
  //   limit: number = 10,
  //   auctionEventIds?: number[],
  //   filterType?: string,
  //   fromDate?: string,
  //   toDate?: string,
  //   withResponses?: boolean,
  //   withStopResponses?: boolean,
  //   sortBy: string = "modified_at",
  //   sortOrder: "ASC" | "DESC" = "DESC",
  //   isBookmarked?: boolean,
  //   searchTerm?: string,
  //   eventTypeIds?: number[]
  // ): Promise<{ data: AddressEntity[]; totalCount: number }> {
  //   try {
  //     const queryBuilder = this.addressRepository
  //       .createQueryBuilder("address")
  //       .leftJoinAndSelect("address.events", "event")
  //       .where("address.is_active = :isActive", { isActive: true });

  //     if (auctionEventIds && auctionEventIds.length > 0) {
  //       queryBuilder.andWhere(
  //         "address.auction_event_id IN (:...auctionEventIds)",
  //         { auctionEventIds }
  //       );
  //     }

  //     // Updated event type filtering logic
  //     if (eventTypeIds && eventTypeIds.length > 0) {
  //       queryBuilder.andWhere((qb) => {
  //         const conversationsSubQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e.conversation_id)")
  //           .from(OpenPhoneEventEntity, "e")
  //           .where(
  //             new Brackets((sqb) => {
  //               // Handle received events
  //               if (eventTypeIds.includes(1)) {
  //                 sqb.orWhere(
  //                   "(e.event_type_id = :receivedTypeId AND e.event_direction_id = :incomingDirection)"
  //                 );
  //               }
  //               // Handle delivered events
  //               if (eventTypeIds.includes(2)) {
  //                 sqb.orWhere(
  //                   "(e.event_type_id = :deliveredTypeId AND e.event_direction_id = :outgoingDirection)"
  //                 );
  //               }
  //             })
  //           )
  //           .getQuery();

  //         // Now get address IDs from these conversations
  //         const addressSubQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e2.address_id)")
  //           .from(OpenPhoneEventEntity, "e2")
  //           .where(`e2.conversation_id IN (${conversationsSubQuery})`)
  //           .getQuery();

  //         return "address.id IN " + addressSubQuery;
  //       });

  //       // Set parameters for event type filtering
  //       queryBuilder
  //         .setParameter("receivedTypeId", 1)
  //         .setParameter("deliveredTypeId", 2)
  //         .setParameter("incomingDirection", 1)
  //         .setParameter("outgoingDirection", 2);
  //     }

  //     // Rest of the filtering logic remains the same
  //     if (filterType === "weekly") {
  //       const startOfWeek = moment().startOf("week").toDate();
  //       const endOfWeek = moment().endOf("week").toDate();
  //       queryBuilder.andWhere(
  //         "address.created_at BETWEEN :startOfWeek AND :endOfWeek",
  //         {
  //           startOfWeek,
  //           endOfWeek,
  //         }
  //       );
  //     } else if (filterType === "monthly") {
  //       const startOfMonth = moment().startOf("month").toDate();
  //       const endOfMonth = moment().endOf("month").toDate();
  //       queryBuilder.andWhere(
  //         "address.created_at BETWEEN :startOfMonth AND :endOfMonth",
  //         {
  //           startOfMonth,
  //           endOfMonth,
  //         }
  //       );
  //     }

  //     if (fromDate && toDate) {
  //       const startDate = moment(fromDate).startOf("day").toDate();
  //       const endDate = moment(toDate).endOf("day").toDate();
  //       queryBuilder.andWhere(
  //         "address.created_at BETWEEN :startDate AND :endDate",
  //         {
  //           startDate,
  //           endDate,
  //         }
  //       );
  //     }

  //     if (withResponses) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e1.address_id)")
  //           .from(OpenPhoneEventEntity, "e1")
  //           .innerJoin(
  //             OpenPhoneEventEntity,
  //             "e2",
  //             "e1.conversation_id = e2.conversation_id"
  //           )
  //           .where("e1.event_direction_id = :incomingDirection", {
  //             incomingDirection: 2,
  //           })
  //           .andWhere("e2.event_direction_id = :outgoingDirection", {
  //             outgoingDirection: 1,
  //           })
  //           .andWhere((qb) => {
  //             const activeConversationSubQuery = qb
  //               .subQuery()
  //               .select("1")
  //               .from(OpenPhoneEventEntity, "e3")
  //               .where("e3.address_id = e1.address_id")
  //               .andWhere("e3.conversation_id = e1.conversation_id")
  //               .andWhere("(e3.body != :stopMessage AND e3.is_stop = :isStop)")
  //               .getQuery();
  //             return "EXISTS " + activeConversationSubQuery;
  //           })
  //           .getQuery();
  //         return "address.id IN " + subQuery;
  //       });
  //       queryBuilder
  //         .setParameter("stopMessage", "Stop")
  //         .setParameter("isStop", false);
  //     }

  //     if (withStopResponses) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e.address_id)")
  //           .from(OpenPhoneEventEntity, "e")
  //           .where("e.event_direction_id IN (:...directionIds)", {
  //             directionIds: [1, 2],
  //           })
  //           .andWhere("(e.body = :stopMessage OR e.is_stop = :isStop)")
  //           .getQuery();
  //         return "address.id IN " + subQuery;
  //       });
  //       queryBuilder
  //         .setParameter("stopMessage", "Stop")
  //         .setParameter("isStop", true);
  //     }

  //     if (searchTerm) {
  //       queryBuilder.andWhere(
  //         new Brackets((qb) => {
  //           qb.where("address.address ILIKE :searchTerm", {
  //             searchTerm: `%${searchTerm}%`,
  //           });
  //         })
  //       );
  //     }

  //     if (isBookmarked !== undefined) {
  //       queryBuilder.andWhere("address.is_bookmarked = :isBookmarked", {
  //         isBookmarked,
  //       });
  //     }

  //     if (sortBy === "modified_at") {
  //       queryBuilder.orderBy("address.modified_at", sortOrder);
  //     } else {
  //       queryBuilder.orderBy(`address.${sortBy}`, sortOrder);
  //     }

  //     queryBuilder.distinct(true);

  //     const [data, totalCount] = await Promise.all([
  //       queryBuilder
  //         .skip((page - 1) * limit)
  //         .take(limit)
  //         .getMany(),
  //       queryBuilder.getCount(),
  //     ]);

  //     return { data, totalCount };
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }

  //with conversation id in response
  // async findAll(
  //   page: number = 1,
  //   limit: number = 10,
  //   auctionEventIds?: number[],
  //   filterType?: string,
  //   fromDate?: string,
  //   toDate?: string,
  //   withResponses?: boolean,
  //   withStopResponses?: boolean,
  //   sortBy: string = "modified_at",
  //   sortOrder: "ASC" | "DESC" = "DESC",
  //   isBookmarked?: boolean,
  //   searchTerm?: string,
  //   eventTypeIds?: number[]
  // ): Promise<{ data: AddressWithConversations[]; totalCount: number }> {
  //   try {
  //     const queryBuilder = this.addressRepository
  //       .createQueryBuilder("address")
  //       .leftJoinAndSelect("address.events", "events")
  //       .where("address.is_active = :isActive", { isActive: true });

  //     // Handle multiple auction event IDs
  //     if (auctionEventIds?.length) {
  //       queryBuilder.andWhere("address.auction_event_id IN (:...auctionEventIds)", {
  //         auctionEventIds
  //       });
  //     }

  //     // Handle event type IDs
  //     if (eventTypeIds?.length) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e.address_id)")
  //           .from(OpenPhoneEventEntity, "e")
  //           .where("e.event_type_id IN (:...eventTypeIds)")
  //           .getQuery();
  //         return "address.id IN " + subQuery;
  //       });
  //       queryBuilder.setParameter("eventTypeIds", eventTypeIds);
  //     }

  //     // Handle withResponses - Modified to check for conversations with both direction IDs
  //     if (withResponses) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e1.address_id)")
  //           .from(OpenPhoneEventEntity, "e1")
  //           .where(
  //             `EXISTS (
  //               SELECT 1 FROM open_phone_event e2
  //               WHERE e2.conversation_id = e1.conversation_id
  //               AND e2.event_direction_id = 1
  //             )`
  //           )
  //           .andWhere(
  //             `EXISTS (
  //               SELECT 1 FROM open_phone_event e3
  //               WHERE e3.conversation_id = e1.conversation_id
  //               AND e3.event_direction_id = 2
  //             )`
  //           )
  //           .andWhere(
  //             `NOT EXISTS (
  //               SELECT 1 FROM open_phone_event e4
  //               WHERE e4.conversation_id = e1.conversation_id
  //               AND (e4.body = :stopMessage OR e4.is_stop = :isStop)
  //             )`
  //           )
  //           .getQuery();
  //         return "address.id IN " + subQuery;
  //       });
  //       queryBuilder
  //         .setParameter("stopMessage", "Stop")
  //         .setParameter("isStop", true);
  //     }

  //     // Handle withStopResponses
  //     if (withStopResponses) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e.address_id)")
  //           .from(OpenPhoneEventEntity, "e")
  //           .where("e.event_direction_id IN (:...directionIds)", {
  //             directionIds: [1, 2]
  //           })
  //           .andWhere("(e.body = :stopMessage OR e.is_stop = :isStop)")
  //           .getQuery();
  //         return "address.id IN " + subQuery;
  //       });
  //       queryBuilder
  //         .setParameter("stopMessage", "Stop")
  //         .setParameter("isStop", true);
  //     }

  //     // Handle date filters
  //     if (filterType === "weekly") {
  //       const startOfWeek = moment().startOf("week").toDate();
  //       const endOfWeek = moment().endOf("week").toDate();
  //       queryBuilder.andWhere(
  //         "address.created_at BETWEEN :startOfWeek AND :endOfWeek",
  //         { startOfWeek, endOfWeek }
  //       );
  //     } else if (filterType === "monthly") {
  //       const startOfMonth = moment().startOf("month").toDate();
  //       const endOfMonth = moment().endOf("month").toDate();
  //       queryBuilder.andWhere(
  //         "address.created_at BETWEEN :startOfMonth AND :endOfMonth",
  //         { startOfMonth, endOfMonth }
  //       );
  //     }

  //     if (fromDate && toDate) {
  //       const startDate = moment(fromDate).startOf("day").toDate();
  //       const endDate = moment(toDate).endOf("day").toDate();
  //       queryBuilder.andWhere(
  //         "address.created_at BETWEEN :startDate AND :endDate",
  //         { startDate, endDate }
  //       );
  //     }

  //     // Handle search
  //     if (searchTerm) {
  //       queryBuilder.andWhere(
  //         new Brackets((qb) => {
  //           qb.where("address.address ILIKE :searchTerm", {
  //             searchTerm: `%${searchTerm}%`
  //           });
  //         })
  //       );
  //     }

  //     // Handle bookmarks
  //     if (isBookmarked !== undefined) {
  //       queryBuilder.andWhere("address.is_bookmarked = :isBookmarked", {
  //         isBookmarked
  //       });
  //     }

  //     // Add sorting
  //     if (sortBy === "modified_at") {
  //       queryBuilder.orderBy("address.modified_at", sortOrder);
  //     } else {
  //       queryBuilder.orderBy(`address.${sortBy}`, sortOrder);
  //     }

  //     // Make query distinct
  //     queryBuilder.distinct(true);

  //     // Execute query with pagination
  //     const [addresses, totalCount] = await Promise.all([
  //       queryBuilder
  //         .skip((page - 1) * limit)
  //         .take(limit)
  //         .getMany(),
  //       queryBuilder.getCount()
  //     ]);

  //     // Get conversation IDs for each address
  //     const addressesWithConversations: any[] = await Promise.all(
  //       addresses.map(async (address) => {
  //         const conversationIds = await this.openPhoneEventRepository
  //           .createQueryBuilder("event")
  //           .select("DISTINCT event.conversation_id", "conversation_id")
  //           .where("event.address_id = :addressId", { addressId: address.id })
  //           .getRawMany()
  //           .then(results => results.map(result => result.conversation_id));

  //         return {
  //           ...address,
  //           conversation_ids: conversationIds
  //         };
  //       })
  //     );

  //     return {
  //       data: addressesWithConversations,
  //       totalCount
  //     };
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }

  async getAddressesWithResponses(
    page: number,
    limit: number
  ): Promise<[AddressEntity[], number]> {
    const skip = (page - 1) * limit; // Calculate the offset for pagination

    const query = this.addressRepository
      .createQueryBuilder("address")
      .select([
        "address.id",
        "address.created_at",
        "address.address",
        "address.auction_event_id",
        "address.date",
      ])
      .leftJoinAndSelect("address.events", "event") // Keep the existing join with events
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("DISTINCT(e1.address_id)")
          .from(OpenPhoneEventEntity, "e1")
          .innerJoin(
            OpenPhoneEventEntity,
            "e2",
            "e1.conversation_id = e2.conversation_id"
          )
          .where("e1.event_direction_id = :incomingDirection", {
            incomingDirection: 1,
          })
          .andWhere("e2.event_direction_id = :outgoingDirection", {
            outgoingDirection: 2,
          })
          .andWhere((qb) => {
            const activeConversationSubQuery = qb
              .subQuery()
              .select("1")
              .from(OpenPhoneEventEntity, "e3")
              .where("e3.address_id = e1.address_id")
              .andWhere("e3.conversation_id = e1.conversation_id")
              .andWhere("(e3.body != :stopMessage AND e3.is_stop = :isStop)")
              .getQuery();
            return "EXISTS " + activeConversationSubQuery;
          })
          .getQuery();
        return "address.id IN " + subQuery;
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("DISTINCT(event.address_id)")
          .from(OpenPhoneEventEntity, "event")
          .groupBy("event.address_id")
          .having("COUNT(DISTINCT event.conversation_id) > 0")
          .getQuery();
        return "address.id IN " + subQuery;
      })
      .setParameter("stopMessage", "Stop")
      .setParameter("isStop", false)
      .skip(skip) // Apply offset (skip)
      .take(limit) // Apply limit (take)
      .getManyAndCount(); // Retrieve paginated data and total count

    return query; // Returns [data, total]
  }

  async getAddressesWithStopResponses(
    page: number,
    limit: number
  ): Promise<[AddressEntity[], number]> {
    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    try {
      // Fetch the result and total count from the database
      const [result, totalCount] = await this.addressRepository
        .createQueryBuilder("address")
        .leftJoinAndSelect("address.events", "event")
        .where((qb) => {
          const subQuery = qb
            .subQuery()
            .select("DISTINCT(e.address_id)")
            .from(OpenPhoneEventEntity, "e")
            .where("e.event_direction_id = :outgoingDirection", {
              outgoingDirection: 2,
            })
            .andWhere("(e.body = :stopMessage OR e.is_stop = :isStop)")
            .getQuery();
          return "address.id IN " + subQuery;
        })
        .setParameter("stopMessage", "Stop")
        .setParameter("isStop", true)
        .select(["address.id", "address.address", "address.auction_event_id"])
        .skip(skip) // Pagination: Skip number of records
        .take(limit) // Pagination: Limit the number of records
        .getManyAndCount(); // Fetch both the result and total count

      return [result, totalCount];
    } catch (error) {
      throw new Error(`Failed to fetch stop responses: ${error.message}`);
    }
  }

  async searchAddresses(searchTerm: string): Promise<AddressEntity[]> {
    try {
      return this.addressRepository.find({
        where: [
          { address: ILike(`%${searchTerm}%`) },
          { created_by: ILike(`%${searchTerm}%`) },
        ],
        take: 10,
      });
    } catch (error) {
      console.error("Error searching addresses:", error);
      throw new InternalServerErrorException("Error searching addresses");
    }
  }

  async getAddressIdByAddress(address: string): Promise<number | null> {
    try {
      const foundAddress = await this.addressRepository.findOne({
        where: { address },
        select: ["id"],
      });

      return foundAddress ? foundAddress.id : null;
    } catch (error) {
      console.error("Error getting address ID:", error);
      throw new InternalServerErrorException("Error getting address ID");
    }
  }
}
