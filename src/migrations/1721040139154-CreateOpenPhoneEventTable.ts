import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOpenPhoneEventTable1234567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "open_phone_event",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "event_type_id",
                    type: "int",
                },
                {
                    name: "address_id",
                    type: "int",
                },
                {
                    name: "event_direction_id",
                    type: "int",
                },
                {
                    name: "from",
                    type: "varchar",
                },
                {
                    name: "to",
                    type: "varchar",
                },
                {
                    name: "body",
                    type: "text",
                },
                {
                    name: "url",
                    type: "varchar",
                },
                {
                    name: "url_type",
                    type: "varchar",
                },
                {
                    name: "conversation_id",
                    type: "varchar",
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "received_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("open_phone_event");
    }
}