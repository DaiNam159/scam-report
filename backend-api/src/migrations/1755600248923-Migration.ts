import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1755600248923 implements MigrationInterface {
    name = 'Migration1755600248923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`stats\` (\`id\` int NOT NULL, \`lookup_count\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`stats\``);
    }

}
