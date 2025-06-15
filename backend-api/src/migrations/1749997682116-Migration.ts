import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749997682116 implements MigrationInterface {
    name = 'Migration1749997682116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` ADD \`contact\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` DROP COLUMN \`contact\``);
    }

}
