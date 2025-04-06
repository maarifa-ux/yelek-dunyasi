import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClubRoleSettings1717495000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Önce ClubRank enum tipi oluştur
    await queryRunner.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'club_role_setting_rank_enum') THEN
              CREATE TYPE "public"."club_role_setting_rank_enum" AS ENUM (
                'general_president',
                'general_coach',
                'general_road_captain',
                'general_coordinator',
                'general_discipline',
                'general_treasurer',
                'city_president',
                'city_coach',
                'city_road_captain',
                'city_coordinator',
                'city_discipline',
                'city_treasurer',
                'member',
                'prospect',
                'hangaround'
              );
          END IF;
      END$$;
    `);

    // Tabloyu kontrol et ve yoksa oluştur
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "club_role_setting" (
        "rank" "public"."club_role_setting_rank_enum" NOT NULL,
        "description" character varying NOT NULL,
        "canCreateEvent" boolean NOT NULL DEFAULT false,
        "canManageMembers" boolean NOT NULL DEFAULT false,
        "canManageCity" boolean NOT NULL DEFAULT false, 
        "canSendAnnouncement" boolean NOT NULL DEFAULT false,
        "canAddProduct" boolean NOT NULL DEFAULT false,
        "canManageClub" boolean NOT NULL DEFAULT false,
        "canRemoveMember" boolean NOT NULL DEFAULT false,
        "canManageEvents" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_club_role_setting_rank" PRIMARY KEY ("rank")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Tabloyu kaldır
    await queryRunner.query(`DROP TABLE IF EXISTS "club_role_setting"`);

    // Enum tipi kaldır
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."club_role_setting_rank_enum"
    `);
  }
}
