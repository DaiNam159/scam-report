import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749994133615 implements MigrationInterface {
    name = 'Migration1749994133615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_website\` DROP COLUMN \`screenshot_url\``);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP COLUMN \`evidence\``);
        await queryRunner.query(`ALTER TABLE \`report_phone\` DROP COLUMN \`reason\``);
        await queryRunner.query(`ALTER TABLE \`report_email_address\` DROP COLUMN \`reason\``);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD \`evidence\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` DROP COLUMN \`evidence\``);
        await queryRunner.query(`ALTER TABLE \`report_email_address\` ADD \`reason\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_phone\` ADD \`reason\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD \`evidence\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_website\` ADD \`screenshot_url\` text NULL`);
    }

}
