import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverToClub1745845068826 implements MigrationInterface {
  name = 'AddCoverToClub1745845068826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "club" ADD "cover" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "club" DROP COLUMN "cover"`);
  }
}
