

import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddressMappingTable1721370658765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "address_mapping",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "address_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "conversation_id",
            type: "int",
            isNullable: true,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("address_mapping");
  }
}
