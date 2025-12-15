import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765735591640 implements MigrationInterface {
    name = 'Migration1765735591640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phoneNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`city\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`country\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`birthDate\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`bio\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`emailVerified\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastLoginAt\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastLoginAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`emailVerified\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`bio\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`birthDate\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`country\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`city\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`address\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phoneNumber\``);
    }

}
