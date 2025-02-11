import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class UsersTable1739256624861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: true,
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "roleid",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "modified_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
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
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "users",
      new TableForeignKey({
        columnNames: ["roleid"],
        referencedColumnNames: ["id"],
        referencedTableName: "roles",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
