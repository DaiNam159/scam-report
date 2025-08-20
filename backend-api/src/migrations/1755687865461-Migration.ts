import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755687865461 implements MigrationInterface {
    name = 'Migration1755687865461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isActive\``);
    }

}
