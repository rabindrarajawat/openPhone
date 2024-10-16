import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { AddressDto } from "../dto/address.dto";
import { AddressEntity } from "../entities/address.entity";
import { OpenPhoneEventEntity } from "src/entities/open-phone-event.entity";
import * as moment from "moment";
  
@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @InjectRepository(OpenPhoneEventEntity)
    private openPhoneEventRepository: Repository<OpenPhoneEventEntity>
  ) {}

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

  // Pagination code
  // async findAll(
  //   page: number = 1,
  //   limit: number = 10
  // ): Promise<{ data: AddressEntity[]; totalCount: number }> {
  //   if (isNaN(page) || page <= 0) {
  //     page = 1;
  //   }
  //   if (isNaN(limit) || limit <= 0) {
  //     limit = 10;
  //   }
  //   try {
  //     const [data, totalCount] = await this.addressRepository.findAndCount({
  //       where: { is_active: true },
  //       order: { created_at: "DESC" },
  //       skip: (page - 1) * limit,
  //       take: limit,
  //     });

  //     return { data, totalCount };
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }

  // async findAll(
  //   page: number = 1,
  //   limit: number = 10,
  //   auctionEventId?: number,
  //   filterType?: string, // 'weekly', 'monthly', or 'custom'
  //   fromDate?: string, // for custom date range filtering
  //   toDate?: string // for custom date range filtering
  // ): Promise<{ data: AddressEntity[]; totalCount: number }> {
  //   if (isNaN(page) || page <= 0) {
  //     page = 1;
  //   }
  //   if (isNaN(limit) || limit <= 0) {
  //     limit = 10;
  //   }

  //   try {
  //     const queryBuilder = this.addressRepository
  //       .createQueryBuilder("address")
  //       .where("address.is_active = :isActive", { isActive: true });

  //     // Apply auction event ID filter
  //     if (auctionEventId) {
  //       queryBuilder.andWhere("address.auction_event_id = :auctionEventId", {
  //         auctionEventId,
  //       });
  //     }

  //     // Apply weekly or monthly filters based on 'created_at' column
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

  //     // Apply custom date range filter (fromDate and toDate)
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

  //     // Pagination
  //     queryBuilder.skip((page - 1) * limit).take(limit);

  //     // Fetch the data and total count
  //     const [data, totalCount] = await queryBuilder.getManyAndCount();

  //     return { data, totalCount };
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }




//without modify sorting 
  // async findAll(
  //   page: number = 1,
  //   limit: number = 10,
  //   auctionEventId?: number,
  //   filterType?: string,
  //   fromDate?: string,
  //   toDate?: string,
  //   withResponses?: boolean,
  //   withStopResponses?: boolean
  // ): Promise<{ data: AddressEntity[]; totalCount: number }> {
  //   if (isNaN(page) || page <= 0) page = 1;
  //   if (isNaN(limit) || limit <= 0) limit = 10;

  //   try {
  //     const queryBuilder = this.addressRepository
  //       .createQueryBuilder("address")
  //       .where("address.is_active = :isActive", { isActive: true });

  //     if (auctionEventId) {
  //       queryBuilder.andWhere("address.auction_event_id = :auctionEventId", { auctionEventId });
  //     }

  //     if (filterType === "weekly") {
  //       const startOfWeek = moment().startOf("week").toDate();
  //       const endOfWeek = moment().endOf("week").toDate();
  //       queryBuilder.andWhere("address.created_at BETWEEN :startOfWeek AND :endOfWeek", {
  //         startOfWeek,
  //         endOfWeek,
  //       });
  //     } else if (filterType === "monthly") {
  //       const startOfMonth = moment().startOf("month").toDate();
  //       const endOfMonth = moment().endOf("month").toDate();
  //       queryBuilder.andWhere("address.created_at BETWEEN :startOfMonth AND :endOfMonth", {
  //         startOfMonth,
  //         endOfMonth,
  //       });
  //     }

  //     if (fromDate && toDate) {
  //       const startDate = moment(fromDate).startOf("day").toDate();
  //       const endDate = moment(toDate).endOf("day").toDate();
  //       queryBuilder.andWhere("address.created_at BETWEEN :startDate AND :endDate", {
  //         startDate,
  //         endDate,
  //       });
  //     }

  //     if (withResponses) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e1.address_id)")
  //           .from(OpenPhoneEventEntity, "e1")
  //           .innerJoin(OpenPhoneEventEntity, "e2", "e1.conversation_id = e2.conversation_id")
  //           .where("e1.event_direction_id = :incomingDirection", { incomingDirection: 1 })
  //           .andWhere("e2.event_direction_id = :outgoingDirection", { outgoingDirection: 2 })
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
  //       queryBuilder.setParameter("stopMessage", "Stop")
  //         .setParameter("isStop", false);
  //     }

  //     if (withStopResponses) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e.address_id)")
  //           .from(OpenPhoneEventEntity, "e")
  //           .where("e.event_direction_id = :outgoingDirection", { outgoingDirection: 2 })
  //           .andWhere("(e.body = :stopMessage OR e.is_stop = :isStop)")
  //           .getQuery();
  //         return "address.id IN " + subQuery;
  //       });
  //       queryBuilder.setParameter("stopMessage", "Stop")
  //         .setParameter("isStop", true);
  //     }

  //     queryBuilder.skip((page - 1) * limit).take(limit);

  //     const [data, totalCount] = await queryBuilder.getManyAndCount();

  //     return { data, totalCount };
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }


//with modified working filter 
  // async findAll(
  //   page: number = 1,
  //   limit: number = 10,
  //   auctionEventId?: number,
  //   filterType?: string,
  //   fromDate?: string,
  //   toDate?: string,
  //   withResponses?: boolean,
  //   withStopResponses?: boolean,
  //   sortBy: string = "modified_at",
  //   sortOrder: 'ASC' | 'DESC' = 'DESC'
  // ): Promise<{ data: AddressEntity[]; totalCount: number }> {
  //   if (isNaN(page) || page <= 0) page = 1;
  //   if (isNaN(limit) || limit <= 0) limit = 10;

  //   try {
  //     const queryBuilder = this.addressRepository
  //       .createQueryBuilder("address")
  //       .where("address.is_active = :isActive", { isActive: true });

  //     if (auctionEventId) {
  //       queryBuilder.andWhere("address.auction_event_id = :auctionEventId", { auctionEventId });
  //     }

  //     if (filterType === "weekly") {
  //       const startOfWeek = moment().startOf("week").toDate();
  //       const endOfWeek = moment().endOf("week").toDate();
  //       queryBuilder.andWhere("address.created_at BETWEEN :startOfWeek AND :endOfWeek", {
  //         startOfWeek,
  //         endOfWeek,
  //       });
  //     } else if (filterType === "monthly") {
  //       const startOfMonth = moment().startOf("month").toDate();
  //       const endOfMonth = moment().endOf("month").toDate();
  //       queryBuilder.andWhere("address.created_at BETWEEN :startOfMonth AND :endOfMonth", {
  //         startOfMonth,
  //         endOfMonth,
  //       });
  //     }

  //     if (fromDate && toDate) {
  //       const startDate = moment(fromDate).startOf("day").toDate();
  //       const endDate = moment(toDate).endOf("day").toDate();
  //       queryBuilder.andWhere("address.created_at BETWEEN :startDate AND :endDate", {
  //         startDate,
  //         endDate,
  //       });
  //     }

  //     if (withResponses) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e1.address_id)")
  //           .from(OpenPhoneEventEntity, "e1")
  //           .innerJoin(OpenPhoneEventEntity, "e2", "e1.conversation_id = e2.conversation_id")
  //           .where("e1.event_direction_id = :incomingDirection", { incomingDirection: 1 })
  //           .andWhere("e2.event_direction_id = :outgoingDirection", { outgoingDirection: 2 })
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
  //       queryBuilder.setParameter("stopMessage", "Stop")
  //         .setParameter("isStop", false);
  //     }

  //     if (withStopResponses) {
  //       queryBuilder.andWhere((qb) => {
  //         const subQuery = qb
  //           .subQuery()
  //           .select("DISTINCT(e.address_id)")
  //           .from(OpenPhoneEventEntity, "e")
  //           .where("e.event_direction_id = :outgoingDirection", { outgoingDirection: 2 })
  //           .andWhere("(e.body = :stopMessage OR e.is_stop = :isStop)")
  //           .getQuery();
  //         return "address.id IN " + subQuery;
  //       });
  //       queryBuilder.setParameter("stopMessage", "Stop")
  //         .setParameter("isStop", true);
  //     }

  //     // Add sorting
  //     queryBuilder.orderBy(`address.${sortBy}`, sortOrder);

  //     queryBuilder.skip((page - 1) * limit).take(limit);

  //     const [data, totalCount] = await queryBuilder.getManyAndCount();

  //     return { data, totalCount };
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }



  //with recieved and delivered
  async findAll(
    page: number = 1,
    limit: number = 10,
    auctionEventId?: number,
    filterType?: string,
    fromDate?: string,
    toDate?: string,
    withResponses?: boolean,
    withStopResponses?: boolean,
    sortBy: string = "modified_at",
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    eventTypeId?: number
  ): Promise<{ data: AddressEntity[]; totalCount: number }> {
    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 10;

    try {
      const queryBuilder = this.addressRepository
        .createQueryBuilder("address")
        .leftJoinAndSelect("address.events", "event")
        .where("address.is_active = :isActive", { isActive: true });

      if (auctionEventId) {
        queryBuilder.andWhere("address.auction_event_id = :auctionEventId", { auctionEventId });
      }

      if (filterType === "weekly") {
        const startOfWeek = moment().startOf("week").toDate();
        const endOfWeek = moment().endOf("week").toDate();
        queryBuilder.andWhere("address.created_at BETWEEN :startOfWeek AND :endOfWeek", {
          startOfWeek,
          endOfWeek,
        });
      } else if (filterType === "monthly") {
        const startOfMonth = moment().startOf("month").toDate();
        const endOfMonth = moment().endOf("month").toDate();
        queryBuilder.andWhere("address.created_at BETWEEN :startOfMonth AND :endOfMonth", {
          startOfMonth,
          endOfMonth,
        });
      }

      if (fromDate && toDate) {
        const startDate = moment(fromDate).startOf("day").toDate();
        const endDate = moment(toDate).endOf("day").toDate();
        queryBuilder.andWhere("address.created_at BETWEEN :startDate AND :endDate", {
          startDate,
          endDate,
        });
      }

     

      if (withResponses) {
        queryBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select("DISTINCT(e1.address_id)")
            .from(OpenPhoneEventEntity, "e1")
            .innerJoin(OpenPhoneEventEntity, "e2", "e1.conversation_id = e2.conversation_id")
            .where("e1.event_direction_id = :incomingDirection", { incomingDirection: 1 })
            .andWhere("e2.event_direction_id = :outgoingDirection", { outgoingDirection: 2 })
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
        });
        queryBuilder.setParameter("stopMessage", "Stop")
          .setParameter("isStop", false);
      }

      if (withStopResponses) {
        queryBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select("DISTINCT(e.address_id)")
            .from(OpenPhoneEventEntity, "e")
            .where("e.event_direction_id = :outgoingDirection", { outgoingDirection: 2 })
            .andWhere("(e.body = :stopMessage OR e.is_stop = :isStop)")
            .getQuery();
          return "address.id IN " + subQuery;
        });
        queryBuilder.setParameter("stopMessage", "Stop")
          .setParameter("isStop", true);
      }

      // Add event type filter
      if (eventTypeId) {
        queryBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select("DISTINCT(e.address_id)")
            .from(OpenPhoneEventEntity, "e")
            .where("e.event_type_id = :eventTypeId")
            .getQuery();
          return "address.id IN " + subQuery;
        });
        queryBuilder.setParameter("eventTypeId", eventTypeId);
      }

      // Add sorting
      // queryBuilder.orderBy(`address.${sortBy}`, sortOrder);

      if (sortBy === 'modified_at') {
        queryBuilder.orderBy("address.modified_at", sortOrder);
      } else {
        queryBuilder.orderBy(`address.${sortBy}`, sortOrder);
      }





      // Add distinct to avoid duplicate addresses due to the join
      queryBuilder.distinct(true);

      const totalCount = await queryBuilder.getCount();

      const data = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return { data, totalCount };
    } catch (error) {
      console.error("Error finding all addresses:", error);
      throw new InternalServerErrorException("Error finding all addresses");
    }
  }



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
        .select([
          "address.id",
          "address.address",
          "address.auction_event_id",
        ])
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
