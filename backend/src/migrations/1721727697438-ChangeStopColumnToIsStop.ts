import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeStopColumnToIsStop1721727697438
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the new column
    await queryRunner.query(
      `ALTER TABLE "open_phone_event" ADD COLUMN "is_stop" BOOLEAN DEFAULT FALSE`
    );

    // Convert existing data
    await queryRunner.query(
      `UPDATE "open_phone_event" SET "is_stop" = CASE WHEN "stop" = 'yes' THEN TRUE ELSE FALSE END`
    );

    // Drop the old column
    await queryRunner.query(
      `ALTER TABLE "open_phone_event" DROP COLUMN "stop"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the old column
    await queryRunner.query(
      `ALTER TABLE "open_phone_event" ADD COLUMN "stop" VARCHAR(255)`
    );

    // Convert data back
    await queryRunner.query(
      `UPDATE "open_phone_event" SET "stop" = CASE WHEN "is_stop" = TRUE THEN 'yes' ELSE 'no' END`
    );

    // Drop the new column
    await queryRunner.query(
      `ALTER TABLE "open_phone_event" DROP COLUMN "is_stop"`
    );
  }
}
