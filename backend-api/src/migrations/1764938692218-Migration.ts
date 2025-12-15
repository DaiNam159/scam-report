import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764938692218 implements MigrationInterface {
    name = 'Migration1764938692218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isSpam\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isBanned\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isBanned\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isSpam\``);
    }

}
