import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAuctionEventIdAndIsBookmarkedColumns1723640301834
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the column "is_bookmarked" already exists
    const table = await queryRunner.getTable("address");
    const isBookmarkedColumn = table?.findColumnByName("is_bookmarked");

    if (!isBookmarkedColumn) {
      // Add the column if it doesn't exist
      await queryRunner.addColumn(
        "address",
        new TableColumn({
          name: "is_bookmarked",
          type: "boolean",
          isNullable: false,
          default: false,
        })
      );
    }

    // Add the auction_event_id column if it's not already added
    const auctionEventIdColumn = table?.findColumnByName("auction_event_id");
    if (!auctionEventIdColumn) {
      await queryRunner.addColumn(
        "address",
        new TableColumn({
          name: "auction_event_id",
          type: "int",
          isNullable: false,
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("address");

    if (table?.findColumnByName("is_bookmarked")) {
      await queryRunner.dropColumn("address", "is_bookmarked");
    }

    if (table?.findColumnByName("auction_event_id")) {
      await queryRunner.dropColumn("address", "auction_event_id");
    }
  }
}
