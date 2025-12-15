import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764938752816 implements MigrationInterface {
    name = 'Migration1764938752816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`banReason\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`banReason\``);
    }

}
