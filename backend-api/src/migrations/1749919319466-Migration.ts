import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749919319466 implements MigrationInterface {
    name = 'Migration1749919319466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` DROP COLUMN \`reporter_ip\``);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD \`user_ip\` varchar(45) NULL`);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD CONSTRAINT \`FK_ca7a21eb95ca4625bd5eaef7e0c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reports\` DROP FOREIGN KEY \`FK_ca7a21eb95ca4625bd5eaef7e0c\``);
        await queryRunner.query(`ALTER TABLE \`reports\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`reports\` DROP COLUMN \`user_ip\``);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD \`reporter_ip\` varchar(45) NULL`);
    }

}
