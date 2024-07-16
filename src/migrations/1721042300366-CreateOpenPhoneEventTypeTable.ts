import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOpenPhoneEventTypeTable1721041606420 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name:"open_phone_event_type",
            columns :[
                {
                    name:'id',
                    type : 'int',
                    isPrimary:true,
                    isGenerated:true,
                    generationStrategy:"increment"
                }
                ,
                {
                    name:'name',
                    type:"varchar",

                }
            ],
        }),true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("open_phone_event_type")
    }

}


