import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeGamePrimaryColumn1540721887021 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `game` CHANGE `id` `id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `game` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `game` DROP COLUMN `id`");
        await queryRunner.query("ALTER TABLE `game` ADD `id` varchar(255) NOT NULL PRIMARY KEY");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `game` DROP COLUMN `id`");
        await queryRunner.query("ALTER TABLE `game` ADD `id` int NOT NULL AUTO_INCREMENT");
        await queryRunner.query("ALTER TABLE `game` ADD PRIMARY KEY (`id`)");
        await queryRunner.query("ALTER TABLE `game` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT");
    }

}
