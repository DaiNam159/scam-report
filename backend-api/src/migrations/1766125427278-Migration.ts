import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1766125427278 implements MigrationInterface {
    name = 'Migration1766125427278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`news\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`slug\` varchar(500) NULL, \`summary\` text NULL, \`content\` text NOT NULL, \`imageUrl\` varchar(500) NULL, \`status\` enum ('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT', \`views\` int NOT NULL DEFAULT '0', \`isFeatured\` tinyint NOT NULL DEFAULT 0, \`authorId\` int NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`publishedAt\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`news\` ADD CONSTRAINT \`FK_18ab67e7662dbc5d45dc53a6e00\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_18ab67e7662dbc5d45dc53a6e00\``);
        await queryRunner.query(`DROP TABLE \`news\``);
    }

}
