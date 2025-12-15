import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765734229132 implements MigrationInterface {
    name = 'Migration1765734229132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatarUrl\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatarUrl\``);
    }

}
