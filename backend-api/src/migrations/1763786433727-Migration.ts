import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763786433727 implements MigrationInterface {
    name = 'Migration1763786433727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_blacklists\` CHANGE \`ip_address\` \`user_ip\` varchar(100) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_blacklists\` CHANGE \`user_ip\` \`ip_address\` varchar(100) NULL`);
    }

}
