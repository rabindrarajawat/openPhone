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
import * as moment from 'moment';

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

  // async findAll(): Promise<AddressEntity[]> {
  //   try {
  //     return this.addressRepository.find();
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }



  // Pagination code
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: AddressEntity[]; totalCount: number }> {
    if (isNaN(page) || page <= 0) {
      page = 1;
    }
    if (isNaN(limit) || limit <= 0) {
      limit = 10;
    }
    try {
      const [data, totalCount] = await this.addressRepository.findAndCount({
        where: { is_active: true },
        order: { created_at: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
      });

      return { data, totalCount };
    } catch (error) {
      console.error("Error finding all addresses:", error);
      throw new InternalServerErrorException("Error finding all addresses");
    }
  }


  // Working filter for auction type id 
  // async findAll(
  //   page: number = 1,
  //   limit: number = 10,
  //   auctionEventId?: number, // Event ID filter
  //   date?: string,
  //   address?: string
  // ): Promise<{ data: AddressEntity[]; totalCount: number }> {
  //   if (isNaN(page) || page <= 0) {
  //     page = 1;
  //   }
  //   if (isNaN(limit) || limit <= 0) {
  //     limit = 10;
  //   }
  
  //   try {
  //     const queryBuilder = this.addressRepository.createQueryBuilder("address");
  
  //     // Filter by auctionEventId if provided
  //     if (auctionEventId) {
  //       queryBuilder.andWhere("address.auction_event_id = :auctionEventId", {
  //         auctionEventId,
  //       });
  //     }
  
  //     // Filter by date if provided
  //     if (date) {
  //       queryBuilder.andWhere("address.date = :date", { date });
  //     }
  
  //     // Filter by address if provided (partial match)
  //     if (address) {
  //       queryBuilder.andWhere("address.address LIKE :address", {
  //         address: `%${address}%`,
  //       });
  //     }
  
  //     // Ensure active addresses only
  //     queryBuilder.andWhere("address.is_active = :isActive", { isActive: true });
  
  //     // Pagination
  //     queryBuilder
  //       .orderBy("address.created_at", "DESC")
  //       .skip((page - 1) * limit)
  //       .take(limit);
  
  //     // Log the query for debugging purposes
  //     console.log("Executing query:", queryBuilder.getQuery());
  //     console.log("Parameters:", queryBuilder.getParameters());
  
  //     const [data, totalCount] = await queryBuilder.getManyAndCount();
  
  //     return { data, totalCount };
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }
  
  





  //by destructuring sending the resposne 
  // async getAddressesWithResponses(): Promise<AddressEntity[]> {
  //   return this.addressRepository
  //     .createQueryBuilder("address")
  //     .leftJoinAndSelect("address.events", "event")
  //     .where((qb) => {
  //       const subQuery = qb
  //         .subQuery()
  //         .select("DISTINCT(e1.address_id)")
  //         .from(OpenPhoneEventEntity, "e1")
  //         .innerJoin(
  //           OpenPhoneEventEntity,
  //           "e2",
  //           "e1.conversation_id = e2.conversation_id"
  //         )
  //         .where("e1.event_direction_id = :incomingDirection", {
  //           incomingDirection: 1,
  //         })
  //         .andWhere("e2.event_direction_id = :outgoingDirection", {
  //           outgoingDirection: 2,
  //         })
  //         .andWhere((qb) => {
  //           const activeConversationSubQuery = qb
  //             .subQuery()
  //             .select("1")
  //             .from(OpenPhoneEventEntity, "e3")
  //             .where("e3.address_id = e1.address_id")
  //             .andWhere("e3.conversation_id = e1.conversation_id")
  //             .andWhere("(e3.body != :stopMessage AND e3.is_stop = :isStop)")
  //             .getQuery();
  //           return "EXISTS " + activeConversationSubQuery;
  //         })
  //         .getQuery();
  //       return "address.id IN " + subQuery;
  //     })
  //     .andWhere((qb) => {
  //       const subQuery = qb
  //         .subQuery()
  //         .select("DISTINCT(event.address_id)")
  //         .from(OpenPhoneEventEntity, "event")
  //         .groupBy("event.address_id")
  //         .having("COUNT(DISTINCT event.conversation_id) > 0")
  //         .getQuery();
  //       return "address.id IN " + subQuery;
  //     })
  //     .setParameter("stopMessage", "Stop")
  //     .setParameter("isStop", false)
  //     .getMany();
  // }


  //by destructuring sending the resposne 
  // async getAddressesWithStopResponses(): Promise<AddressEntity[]> {
  //   return this.addressRepository
  //     .createQueryBuilder("address")
  //     .leftJoinAndSelect("address.events", "event")
  //     .where((qb) => {
  //       const subQuery = qb
  //         .subQuery()
  //         .select("DISTINCT(e.address_id)")
  //         .from(OpenPhoneEventEntity, "e")
  //         .where("e.event_direction_id = :outgoingDirection", {
  //           outgoingDirection: 2,
  //         })
  //         .andWhere("(e.body = :stopMessage OR e.is_stop = :isStop)")
  //         .getQuery();
  //       return "address.id IN " + subQuery;
  //     })
  //     .setParameter("stopMessage", "Stop")
  //     .setParameter("isStop", true)
  //     .getMany();
  // }


  async getAddressesWithResponses(): Promise<AddressEntity[]> {
    return this.addressRepository
      .createQueryBuilder("address")
      .select([
        'address.id',           
        'address.created_at',    
        'address.address',       
        'address.auction_event_id', 
        'address.date',    
      ])
      .leftJoinAndSelect("address.events", "event")  // Keep the existing join with events
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("DISTINCT(e1.address_id)")
          .from(OpenPhoneEventEntity, "e1")
          .innerJoin(OpenPhoneEventEntity, "e2", "e1.conversation_id = e2.conversation_id")
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
      .getMany();
  }
  
  async getAddressesWithStopResponses(): Promise<AddressEntity[]> {
    return this.addressRepository
      .createQueryBuilder('address')
      .leftJoinAndSelect('address.events', 'event')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('DISTINCT(e.address_id)')
          .from(OpenPhoneEventEntity, 'e')
          .where('e.event_direction_id = :outgoingDirection', { outgoingDirection: 2 })
          .andWhere('(e.body = :stopMessage OR e.is_stop = :isStop)')
          .getQuery();
        return 'address.id IN ' + subQuery;
      })
      .setParameter('stopMessage', 'Stop')
      .setParameter('isStop', true)
      // Explicitly select only required fields
      .select([
        'address.id',
        'address.address', // Add the fields you need here
        // You can add other required fields
      ])
      .getMany();
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
