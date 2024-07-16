import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddCommonColumns1721120317439 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables = await queryRunner.getTables();

    for (const table of tables) {
      // Skip system schemas
      if (
        table.schema === "pg_catalog" ||
        table.schema === "information_schema"
      ) {
        continue;
      }

      const columnsToAdd = [
        { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        {
          name: "modified_at",
          type: "timestamp",
          default: "CURRENT_TIMESTAMP",
          onUpdate: "CURRENT_TIMESTAMP",
        },
        { name: "created_by", type: "varchar", isNullable: true },
        { name: "modified_by", type: "varchar", isNullable: true },
        { name: "is_active", type: "boolean", default: true },
      ];

      for (const columnDef of columnsToAdd) {
        const columnExists = table.columns.find(
          (c) => c.name === columnDef.name
        );
        if (!columnExists) {
          await queryRunner.addColumn(table, new TableColumn(columnDef));
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = await queryRunner.getTables();

    for (const table of tables) {
      if (
        table.schema === "pg_catalog" ||
        table.schema === "information_schema"
      ) {
        continue;
      }

      const columnsToRemove = [
        "created_at",
        "modified_at",
        "created_by",
        "modified_by",
        "is_active",
      ];

      for (const columnName of columnsToRemove) {
        const columnExists = table.columns.find((c) => c.name === columnName);
        if (columnExists) {
          await queryRunner.dropColumn(table, columnName);
        }
      }
    }
  }
}
