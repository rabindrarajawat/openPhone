import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaxDeadEntity } from "../entities/tax_deed.entity";
import { TaxDeadDto } from "../dto/tax_dead.dto";

@Injectable()
export class TaxDeadService {
  constructor(
    @InjectRepository(TaxDeadEntity)
    private readonly taxDeadRepository: Repository<TaxDeadEntity>
  ) {}

  async create(taxDeadDto: TaxDeadDto): Promise<TaxDeadEntity> {
    const taxDeadData = this.taxDeadRepository.create(taxDeadDto);
    return this.taxDeadRepository.save(taxDeadData);
  }

  async findAll(): Promise<TaxDeadEntity[]> {
    return this.taxDeadRepository.find();
  }
}
