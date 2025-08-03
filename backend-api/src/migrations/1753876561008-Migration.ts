import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753876561008 implements MigrationInterface {
    name = 'Migration1753876561008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` ADD \`evidence_public_id\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` DROP COLUMN \`evidence_public_id\``);
    }

}
