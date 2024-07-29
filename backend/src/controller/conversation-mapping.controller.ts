import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ConversationMapingService } from "src/service/conversation-mapping.service";

@Controller('conversation-mapping')
export class ConversationMapingController {
    constructor(private readonly conversationMapingService: ConversationMapingService) { }

    @Post('map')
    async mapConversation(@Body() body: { conversationId: string, address: string }) {
        const { conversationId, address } = body;

        if (!conversationId || !address) {
            throw new BadRequestException('Both conversationId and address are required.');
        }

        // Call service to map conversation to address
        return this.conversationMapingService.mapConversationToAddress(conversationId, address);
    }
}
