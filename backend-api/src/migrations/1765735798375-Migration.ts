import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765735798375 implements MigrationInterface {
    name = 'Migration1765735798375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`gender\` enum ('male', 'female', 'other') NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`idNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`organization\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`organization\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`idNumber\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`gender\``);
    }

}
