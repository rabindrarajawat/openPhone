import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAuctionEventIdAndIsBookmarkedColumns1723640301834 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('address', new TableColumn({
            name: 'auction_event_id',
            type: 'int',
            isNullable: true, 
            default: 1, 
        }));

        await queryRunner.addColumn('address', new TableColumn({
            name: 'is_bookmarked',
            type: 'boolean',
            isNullable: true,
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('address', 'auction_event_id');
        await queryRunner.dropColumn('address', 'is_bookmarked');
    }
}
