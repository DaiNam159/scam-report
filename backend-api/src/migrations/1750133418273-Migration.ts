import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750133418273 implements MigrationInterface {
    name = 'Migration1750133418273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`fullName\` varchar(255) NULL, \`isAdmin\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_email_address\` (\`report_id\` int NOT NULL, \`email_address\` varchar(255) NOT NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_email_content\` (\`report_id\` int NOT NULL, \`email_subject\` text NULL, \`email_body\` text NULL, \`sender_address\` varchar(255) NULL, \`attachments\` text NULL, \`suspicious_links\` text NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_phone\` (\`report_id\` int NOT NULL, \`phone_number\` varchar(20) NOT NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_sms\` (\`report_id\` int NOT NULL, \`phone_number\` varchar(20) NOT NULL, \`sms_content\` text NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_social\` (\`report_id\` int NOT NULL, \`platform\` varchar(100) NOT NULL, \`profile_url\` text NULL, \`username\` varchar(255) NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_person_org\` (\`report_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`role\` varchar(255) NULL, \`identification\` text NULL, \`address\` text NULL, \`phone_number\` varchar(100) NULL, \`email_address\` varchar(255) NULL, \`social_links\` text NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_bank_account\` (\`report_id\` int NOT NULL, \`bank_name\` varchar(100) NOT NULL, \`account_number\` varchar(50) NOT NULL, \`account_holder_name\` varchar(255) NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_e_wallet\` (\`report_id\` int NOT NULL, \`wallet_type\` varchar(100) NOT NULL, \`wallet_id\` varchar(100) NOT NULL, \`account_holder_name\` varchar(255) NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reports\` (\`id\` int NOT NULL AUTO_INCREMENT, \`report_type\` enum ('email_content', 'email_address', 'phone', 'sms', 'website', 'social', 'bank_account', 'e_wallet', 'person_org') NOT NULL, \`title\` varchar(255) NULL, \`description\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`evidence\` text NULL, \`user_ip\` varchar(45) NULL, \`status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', \`contact\` text NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report_website\` (\`report_id\` int NOT NULL, \`url\` text NOT NULL, PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`report_email_address\` ADD CONSTRAINT \`FK_0dfdabcc24702b6917a756926c2\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_email_content\` ADD CONSTRAINT \`FK_c52ceac1dcad2693c4c4324f52d\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_phone\` ADD CONSTRAINT \`FK_90aecfc4c023dc4a11b2ff4ac35\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_sms\` ADD CONSTRAINT \`FK_f0e8814dfa11dd2a77698e1aac1\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_social\` ADD CONSTRAINT \`FK_06b4164a27cfdf88bbb810ca919\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` ADD CONSTRAINT \`FK_79ef10634768802058babde2ebe\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_bank_account\` ADD CONSTRAINT \`FK_8f06115839d430adb65aa17d99c\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_e_wallet\` ADD CONSTRAINT \`FK_f3d377643491811affb2f224f06\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reports\` ADD CONSTRAINT \`FK_ca7a21eb95ca4625bd5eaef7e0c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report_website\` ADD CONSTRAINT \`FK_902d70b4e3c3d7465e2bb985664\` FOREIGN KEY (\`report_id\`) REFERENCES \`reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report_website\` DROP FOREIGN KEY \`FK_902d70b4e3c3d7465e2bb985664\``);
        await queryRunner.query(`ALTER TABLE \`reports\` DROP FOREIGN KEY \`FK_ca7a21eb95ca4625bd5eaef7e0c\``);
        await queryRunner.query(`ALTER TABLE \`report_e_wallet\` DROP FOREIGN KEY \`FK_f3d377643491811affb2f224f06\``);
        await queryRunner.query(`ALTER TABLE \`report_bank_account\` DROP FOREIGN KEY \`FK_8f06115839d430adb65aa17d99c\``);
        await queryRunner.query(`ALTER TABLE \`report_person_org\` DROP FOREIGN KEY \`FK_79ef10634768802058babde2ebe\``);
        await queryRunner.query(`ALTER TABLE \`report_social\` DROP FOREIGN KEY \`FK_06b4164a27cfdf88bbb810ca919\``);
        await queryRunner.query(`ALTER TABLE \`report_sms\` DROP FOREIGN KEY \`FK_f0e8814dfa11dd2a77698e1aac1\``);
        await queryRunner.query(`ALTER TABLE \`report_phone\` DROP FOREIGN KEY \`FK_90aecfc4c023dc4a11b2ff4ac35\``);
        await queryRunner.query(`ALTER TABLE \`report_email_content\` DROP FOREIGN KEY \`FK_c52ceac1dcad2693c4c4324f52d\``);
        await queryRunner.query(`ALTER TABLE \`report_email_address\` DROP FOREIGN KEY \`FK_0dfdabcc24702b6917a756926c2\``);
        await queryRunner.query(`DROP TABLE \`report_website\``);
        await queryRunner.query(`DROP TABLE \`reports\``);
        await queryRunner.query(`DROP TABLE \`report_e_wallet\``);
        await queryRunner.query(`DROP TABLE \`report_bank_account\``);
        await queryRunner.query(`DROP TABLE \`report_person_org\``);
        await queryRunner.query(`DROP TABLE \`report_social\``);
        await queryRunner.query(`DROP TABLE \`report_sms\``);
        await queryRunner.query(`DROP TABLE \`report_phone\``);
        await queryRunner.query(`DROP TABLE \`report_email_content\``);
        await queryRunner.query(`DROP TABLE \`report_email_address\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
