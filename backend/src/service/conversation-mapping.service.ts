import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { conversationmapping } from "src/entities/conversation-mapping.entity";
import { AddressService } from "src/service/address.service";

@Injectable()
export class ConversationMapingService {
    constructor(
        @InjectRepository(conversationmapping)
        private readonly conversationmapingRepository: Repository<conversationmapping>,
        private readonly addressService: AddressService
    ) { }

    async mapConversationToAddress(conversationId: string, address: string): Promise<conversationmapping> {
        // Get address_id from address service
        const addressId = await this.addressService.getAddressIdByAddress(address);

        if (!addressId) {
            throw new NotFoundException(`Address not found: ${address}`);
        }

        // Log the addressId for debugging
        // console.log(`Address ID for address ${address}: ${addressId}`);

        // Create a new mapping
        const newMapping = this.conversationmapingRepository.create({
            conversation_id: conversationId,
            address_id: addressId,
        });

        // Save the mapping to the database
        return this.conversationmapingRepository.save(newMapping);
    }
}
