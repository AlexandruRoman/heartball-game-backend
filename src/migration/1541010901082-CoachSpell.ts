import {MigrationInterface, QueryRunner} from "typeorm";

export class CoachSpell1541010901082 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `coach_spell` ADD `nameSpell` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `coach_spell` DROP COLUMN `nameSpell`");
    }

}
