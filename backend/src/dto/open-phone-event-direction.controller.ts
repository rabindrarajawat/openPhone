// import { Body, Controller, Get, Post } from "@nestjs/common";
// import { OpenPhoneEventDirectionDTO } from "src/dto/open-phone-event-direction.dto";
// import { OpenPhoneEventDirectionService } from "src/service/open-phone-event-direction.service";

// @Controller("open-phone-event-direction")
// export class OpenPhoneEventDirectionController {
//   constructor(private readonly openPhoneEventDirectionService: OpenPhoneEventDirectionService) {}

//   @Post()
//   async createOpenPhoneEventType(@Body() openPhoneEventDirectionDto: OpenPhoneEventDirectionDTO) {
//     const createdAddress = await this.openPhoneEventDirectionService.createOpenPhoneEventType(openPhoneEventDirectionDto);
//     return {
//       message: "Open phone event direction data saved successfully",
//       id: createdAddress.id,
//     };
//   }

//   @Get()
//   async getAllAddressData() {
//     return this.openPhoneEventDirectionService.findAll();
//   }
// }
