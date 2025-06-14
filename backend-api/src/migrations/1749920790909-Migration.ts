import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749920790909 implements MigrationInterface {
    name = 'Migration1749920790909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_phone\` CHANGE \`message_content\` \`reason\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_phone\` CHANGE \`reason\` \`message_content\` text NULL`);
    }

}
