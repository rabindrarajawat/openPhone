import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CaseEventDto } from "src/dto/case-event.dto";
import { CaseEventEntity } from "src/entities/case-event.entity";
import { Repository } from "typeorm";

@Injectable()
export class CaseEventService {
  constructor(
    @InjectRepository(CaseEventEntity)
    private readonly caseEventRepository: Repository<CaseEventEntity>
  ) {}

  async create(caseEventDto: CaseEventDto): Promise<CaseEventEntity> {
    const caseEventData = this.caseEventRepository.create(caseEventDto);

    const x = await this.caseEventRepository.save(caseEventData);
    return x;
  }

  async findAll(): Promise<CaseEventEntity[]> {
    return this.caseEventRepository.find();
  }
}

















// import { Injectable, Logger } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { CaseEventDto } from "src/dto/case-event.dto";
// import { CaseEventEntity } from "src/entities/case-event.entity";
// import { Repository, Connection } from "typeorm";

// @Injectable()
// export class CaseEventService {
//   private readonly logger = new Logger(CaseEventService.name);

//   constructor(
//     @InjectRepository(CaseEventEntity)
//     private readonly caseEventRepository: Repository<CaseEventEntity>,
//    ) {}

//   async create(
//     caseEventDto: CaseEventDto
//   ): Promise<CaseEventEntity> {
//     const queryRunner = this.connection.createQueryRunner();

//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       const caseEventData = this.caseEventRepository.create(caseEventDto);
//       this.logger.log(`Creating case event data: ${JSON.stringify(caseEventData)}`);

//       const savedData = await queryRunner.manager.save(caseEventData);
//       this.logger.log(`Saved case event data: ${JSON.stringify(savedData)}`);

//       await queryRunner.commitTransaction();
//       return savedData;
//     } catch (err) {
//       this.logger.error(`Failed to save case event data: ${err.message}`, err.stack);
//       await queryRunner.rollbackTransaction();
//       throw err;
//     } finally {
//       await queryRunner.release();
//     }
//   }

//   async findAll(): Promise<CaseEventEntity[]> {
//     try {
//       const allData = await this.caseEventRepository.find();
//       this.logger.log(`Retrieved ${allData.length} case event records`);
//       return allData;
//     } catch (err) {
//       this.logger.error(`Failed to retrieve case event data: ${err.message}`, err.stack);
//       throw err;
//     }
//   }
// }
