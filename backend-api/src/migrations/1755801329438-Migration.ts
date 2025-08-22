import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755801329438 implements MigrationInterface {
    name = 'Migration1755801329438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`website_visits\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`ip\` varchar(255) NOT NULL, \`visitedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`website_visits\``);
    }

}
