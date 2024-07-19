import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsInAddressTable1721299043534
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "address",
      new TableColumn({
        name: "conversation_id",
        type: "int",
        isNullable: false,
        // isGenerated: true,
        // generationStrategy: "increment",
      })
    );

    await queryRunner.addColumn(
      "address",
      new TableColumn({
        name: "name",
        type: "varchar",
        length: "255",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("address", "conversation_id");
    await queryRunner.dropColumn("address", "name");
  }
}
