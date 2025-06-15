import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749996823677 implements MigrationInterface {
    name = 'Migration1749996823677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` ADD \`contact\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` DROP COLUMN \`contact\``);
    }

}
