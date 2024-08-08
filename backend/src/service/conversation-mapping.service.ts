// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { conversationmapping } from "src/entities/conversation-mapping.entity";
// import { AddressService } from "src/service/address.service";
// import { OpenPhoneEventEntity } from "src/entities/open-phone-event.entity";

// @Injectable()
// export class ConversationMapingService {
//     constructor(
//         @InjectRepository(conversationmapping)
//         private readonly conversationmapingRepository: Repository<conversationmapping>,
//         private openPhoneEventRepository: Repository<OpenPhoneEventEntity>,

//         private readonly addressService: AddressService
//     ) { }

//     async mapConversationToAddress(conversationId: string, address: string): Promise<conversationmapping> {
//         // Get address_id from address service
//         const addressId = await this.addressService.getAddressIdByAddress(address);

//         if (!addressId) {
//             throw new NotFoundException(`Address not found: ${address}`);
//         }

//         // Create a new mapping
//         const newMapping = this.conversationmapingRepository.create({
//             conversation_id: conversationId,
//             address_id: addressId,
//         });

//         // Save the mapping to the database
//         const savedMapping = await this.conversationmapingRepository.save(newMapping);

//         // Update the address_id in openPhoneEvent table for the matching conversation_id
//         const events = await this.openPhoneEventRepository.find({
//             where: { conversation_id: conversationId },
//             order: { id: 'ASC' }, // Sort by ID in ascending order
//         });

//         if (events.length > 0) {
//             // Assuming you want to update all records with the same conversation_id
//             // Remove the `.slice(0, 4)` if you want to update all records, not just the first four.
//             const eventsToUpdate = events.slice(0, 4); // Update only the first 4 records if there are multiple

//             for (const event of eventsToUpdate) {
//                 event.address_id = addressId;
//                 await this.openPhoneEventRepository.save(event);
//             }
//         }

//         return savedMapping;
//     }

// }
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { conversationmapping } from "src/entities/conversation-mapping.entity";
import { AddressService } from "src/service/address.service";
import { OpenPhoneEventEntity } from "src/entities/open-phone-event.entity";

@Injectable()
export class ConversationMapingService {
    constructor(
        @InjectRepository(conversationmapping)
        private readonly conversationmapingRepository: Repository<conversationmapping>,
        @InjectRepository(OpenPhoneEventEntity)
        private readonly openPhoneEventRepository: Repository<OpenPhoneEventEntity>,
        private readonly addressService: AddressService
    ) { }

    async mapConversationToAddress(conversationId: string, address: string): Promise<conversationmapping> {
        // Get address_id from address service
        const addressId = await this.addressService.getAddressIdByAddress(address);

        if (!addressId) {
            throw new NotFoundException(`Address not found: ${address}`);
        }

        // Create a new mapping
        const newMapping = this.conversationmapingRepository.create({
            conversation_id: conversationId,
            address_id: addressId,
        });

        // Save the mapping to the database
        const savedMapping = await this.conversationmapingRepository.save(newMapping);

        // Update the address_id in the openPhoneEvent table for the first matching conversation_id record
        const firstEvent = await this.openPhoneEventRepository.findOne({
            where: { conversation_id: conversationId },
            order: { id: 'ASC' }, // Sort by ID in ascending order to get the first record
        });

        if (firstEvent) {
            firstEvent.address_id = addressId;
            await this.openPhoneEventRepository.save(firstEvent);
        }

        return savedMapping;
    }
}
