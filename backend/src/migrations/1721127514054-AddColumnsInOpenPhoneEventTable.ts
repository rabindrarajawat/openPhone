import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsInOpenPhoneEventTable1721127514054 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('open_phone_event', new TableColumn({
            name: 'contact_established',
            type: 'varchar',
            isNullable: true,
        }));

        await queryRunner.addColumn('open_phone_event', new TableColumn({
            name: 'dead',
            type: 'varchar',
            isNullable: true,
        }));

        await queryRunner.addColumn('open_phone_event', new TableColumn({
            name: 'keep_an_eye',
            type: 'varchar',
            isNullable: true,
        }));

        await queryRunner.addColumn('open_phone_event', new TableColumn({
            name: 'stop',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('open_phone_event', 'contact_established');
        await queryRunner.dropColumn('open_phone_event', 'dead');
        await queryRunner.dropColumn('open_phone_event', 'keep_an_eye');
        await queryRunner.dropColumn('open_phone_event', 'stop');
    }
}
