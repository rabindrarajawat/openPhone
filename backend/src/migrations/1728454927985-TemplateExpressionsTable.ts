import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class TemplateExpressionsTable1728454927985 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "template_expressions",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              {
                name: "name",
                type: "varchar",
              },
              {
                name: "address_expression",
                type: "text",
              },
              {
                name: "type_expression",
                type: "text",
              },
              {
                name: "name_regex",
                type: "text",
              },
              {
                name: "date_regex",
                type: "text",
              },
              {
                name: "disaster_assistance_expression",
                type: "text",
              },
              // Common columns
              {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
              {
                name: "modified_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
              },
              {
                name: "created_by",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "modified_by",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "is_active",
                type: "boolean",
                default: true,
              },
            ],
          })
        );
      }

      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("template_expressions");
      }

}
