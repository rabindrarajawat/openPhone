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
  ): Promise<{ data: AddressEntity[]; totalCount: number }> {
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

      // Handle event type IDs (including received/delivered)
      if (eventTypeIds && eventTypeIds.length > 0) {
        queryBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select("DISTINCT(e.address_id)")
            .from(OpenPhoneEventEntity, "e")
            .where("e.event_type_id IN (:...eventTypeIds)")
            .getQuery();
          return "address.id IN " + subQuery;
        });
        queryBuilder.setParameter("eventTypeIds", eventTypeIds);
      }

      if (filterType === "weekly") {
        const startOfWeek = moment().startOf("week").toDate();
        const endOfWeek = moment().endOf("week").toDate();
        queryBuilder.andWhere(
          "address.created_at BETWEEN :startOfWeek AND :endOfWeek",
          {
            startOfWeek,
            endOfWeek,
          }
        );
      } else if (filterType === "monthly") {
        const startOfMonth = moment().startOf("month").toDate();
        const endOfMonth = moment().endOf("month").toDate();
        queryBuilder.andWhere(
          "address.created_at BETWEEN :startOfMonth AND :endOfMonth",
          {
            startOfMonth,
            endOfMonth,
          }
        );
      }

      if (fromDate && toDate) {
        const startDate = moment(fromDate).startOf("day").toDate();
        const endDate = moment(toDate).endOf("day").toDate();
        queryBuilder.andWhere(
          "address.created_at BETWEEN :startDate AND :endDate",
          {
            startDate,
            endDate,
          }
        );
      }

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
        queryBuilder
          .setParameter("stopMessage", "Stop")
          .setParameter("isStop", false);
      }

      if (withStopResponses) {
        queryBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select("DISTINCT(e.address_id)")
            .from(OpenPhoneEventEntity, "e")
            // .where("e.event_direction_id = :outgoingDirection", { outgoingDirection: 2 })
            .where("e.event_direction_id IN (:...directionIds)", {
              directionIds: [1, 2],
            })
            .andWhere("(e.body = :stopMessage OR e.is_stop = :isStop)")
            .getQuery();
          return "address.id IN " + subQuery;
        });
        queryBuilder
          .setParameter("stopMessage", "Stop")
          .setParameter("isStop", true);
      }

      // Add event type filter
      // if (eventTypeId) {
      //   queryBuilder.andWhere((qb) => {
      //     const subQuery = qb
      //       .subQuery()
      //       .select("DISTINCT(e.address_id)")
      //       .from(OpenPhoneEventEntity, "e")
      //       .where("e.event_type_id = :eventTypeId")
      //       .getQuery();
      //     return "address.id IN " + subQuery;
      //   });
      //   queryBuilder.setParameter("eventTypeId", eventTypeId);
      // }

      // if (eventTypeIds && eventTypeIds.length > 0) {
      //   queryBuilder.andWhere((qb) => {
      //     const subQuery = qb
      //       .subQuery()
      //       .select("DISTINCT(e.address_id)")
      //       .from(OpenPhoneEventEntity, "e")
      //       .where("e.event_type_id IN (:...eventTypeIds)")
      //       .getQuery();
      //     return "address.id IN " + subQuery;
      //   });
      //   queryBuilder.setParameter("eventTypeIds", eventTypeIds);
      // }

      if (searchTerm) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("address.address ILIKE :searchTerm", {
              searchTerm: `%${searchTerm}%`,
            });
            // Add any other searchable fields from CommonEntity if needed
          })
        );
      }

      if (isBookmarked !== undefined) {
        queryBuilder.andWhere("address.is_bookmarked = :isBookmarked", {
          isBookmarked,
        });
      }

      // Add sorting
      // queryBuilder.orderBy(`address.${sortBy}`, sortOrder);

      if (sortBy === "modified_at") {
        queryBuilder.orderBy("address.modified_at", sortOrder);
      } else {
        queryBuilder.orderBy(`address.${sortBy}`, sortOrder);
      }

      // Add distinct to avoid duplicate addresses due to the join
      queryBuilder.distinct(true);

      // const totalCount = await queryBuilder.getCount();

      const [data, totalCount] = await Promise.all([
        queryBuilder
          .skip((page - 1) * limit)
          .take(limit)
          .getMany(),
        queryBuilder.getCount(),
      ]);

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
