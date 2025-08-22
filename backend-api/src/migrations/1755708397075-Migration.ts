import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755708397075 implements MigrationInterface {
    name = 'Migration1755708397075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stats\` ADD \`access_count\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`stats\` ADD \`online_count\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stats\` DROP COLUMN \`online_count\``);
        await queryRunner.query(`ALTER TABLE \`stats\` DROP COLUMN \`access_count\``);
    }

}
