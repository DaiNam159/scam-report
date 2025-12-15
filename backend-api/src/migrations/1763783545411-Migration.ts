import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763783545411 implements MigrationInterface {
    name = 'Migration1763783545411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_blacklists\` ADD \`isAdminBlock\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_blacklists\` DROP COLUMN \`isAdminBlock\``);
    }

}
