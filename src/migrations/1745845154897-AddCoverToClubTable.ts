import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverToClubTable1745845154897 implements MigrationInterface {
  name = 'AddCoverToClubTable1745845154897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "club" ADD "cover" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "club" DROP COLUMN "cover"`);
  }
}
