import { MigrationInterface, QueryRunner } from 'typeorm';

export class Offer1694907647437 implements MigrationInterface {
  name = 'Offer1694907647437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`offers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`requirements\` text NOT NULL, \`thumbnail\` varchar(255) NOT NULL, \`is_desktop\` tinyint(1) NOT NULL DEFAULT '0', \`is_android\` tinyint(1) NOT NULL DEFAULT '0', \`is_ios\` tinyint(1) NOT NULL DEFAULT '0', \`offer_url_template\` varchar(256) NOT NULL, \`provider_name\` varchar(255) NULL, \`external_offer_id\` varchar(255) NULL, UNIQUE INDEX \`IDX_272372013b6125aec8790c8ca0\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_272372013b6125aec8790c8ca0\` ON \`offers\``,
    );
    await queryRunner.query(`DROP TABLE \`offers\``);
  }
}
