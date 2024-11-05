import { BadRequestException, Body, Controller, InternalServerErrorException, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/authguard/auth.guard";
import { ConversationMapingService } from "src/service/conversation-mapping.service";
import { CustomLogger } from "src/service/logger.service";

@Controller('conversation-mapping')
@UseGuards(AuthGuard)

export class ConversationMapingController {
    constructor(private readonly conversationMapingService: ConversationMapingService,
        private readonly logger : CustomLogger
    ) { }

    @Post('map')
  async mapConversation(@Body() body: { conversationId: string, address: string }) {
    const { conversationId, address } = body;

    if (!conversationId || !address) {
      this.logger.warn('Validation failed: Both conversationId and address are required.'); // Log validation failure
      throw new BadRequestException('Both conversationId and address are required.');
    }

    try {
      // Call service to map conversation to address
      const result = await this.conversationMapingService.mapConversationToAddress(conversationId, address);
      this.logger.log(`Conversation mapped successfully: conversationId=${conversationId}, address=${address}`); // Log successful response
      return result;
    } catch (error) {
      this.logger.error('Error in mapConversation:', error.message); // Log the error details
      console.error('Error in mapConversation:', error); // Optional: Log to console for local debugging
      throw new InternalServerErrorException('Failed to map conversation to address');
    }
  }
}
