import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1763783381777 implements MigrationInterface {
    name = 'Migration1763783381777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_blacklists\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`ip_address\` varchar(100) NULL, \`block_type\` enum ('USER', 'IP', 'USER_IP') NOT NULL, \`reason\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expires_at\` timestamp NULL, \`blocked_by_admin_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user_blacklists\``);
    }

}
