import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749922456881 implements MigrationInterface {
    name = 'Migration1749922456881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD \`address\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD \`phone_number\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD \`social_links\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD \`evidence\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP COLUMN \`evidence\``);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP COLUMN \`social_links\``);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP COLUMN \`phone_number\``);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP COLUMN \`address\``);
    }

}
