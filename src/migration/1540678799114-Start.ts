import {MigrationInterface, QueryRunner} from "typeorm";

export class Start1540678799114 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `coach` (`id` int NOT NULL, `name` varchar(255) NOT NULL, `country` varchar(255) NOT NULL, `picture` varchar(2000) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `coach_spell` (`id` int NOT NULL, `description` varchar(255) NOT NULL, `effect` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `football_player` (`id` int NOT NULL, `name` varchar(255) NOT NULL, `country` varchar(255) NOT NULL, `picture` varchar(2000) NOT NULL, `position` varchar(255) NOT NULL, `attack` int NOT NULL, `defence` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `game` (`id` int NOT NULL AUTO_INCREMENT, `game` mediumtext NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `spell` (`id` int NOT NULL, `name` varchar(255) NOT NULL, `picture` varchar(2000) NOT NULL, `description` varchar(255) NOT NULL, `effect` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `spell`");
        await queryRunner.query("DROP TABLE `game`");
        await queryRunner.query("DROP TABLE `football_player`");
        await queryRunner.query("DROP TABLE `coach_spell`");
        await queryRunner.query("DROP TABLE `coach`");
    }

}
