import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749922587513 implements MigrationInterface {
    name = 'Migration1749922587513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_person_org\` CHANGE \`email\` \`email_address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP COLUMN \`email_address\``);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD \`email_address\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP COLUMN \`email_address\``);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD \`email_address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` CHANGE \`email_address\` \`email\` varchar(255) NULL`);
    }

}
