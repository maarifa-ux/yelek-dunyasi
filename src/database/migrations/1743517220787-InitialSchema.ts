import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1743517220787 implements MigrationInterface {
  name = 'InitialSchema1743517220787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // UUID eklentisini yükle
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Users tablosu
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying,
                "googleId" character varying,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "nickname" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "city" character varying NOT NULL,
                "district" character varying NOT NULL,
                "driverLicenseType" character varying NOT NULL DEFAULT 'A',
                "clothingSize" character varying NOT NULL DEFAULT 'L',
                "bloodType" character varying NOT NULL DEFAULT 'UNKNOWN',
                "motorcycleBrand" character varying,
                "motorcycleModel" character varying,
                "motorcycleCc" integer,
                "profilePicture" character varying,
                "isEmailVerified" boolean NOT NULL DEFAULT false,
                "isPhoneVerified" boolean NOT NULL DEFAULT false,
                "hasProfilePicture" boolean NOT NULL DEFAULT false,
                "isActive" boolean NOT NULL DEFAULT true,
                "emergencyContactName" character varying,
                "emergencyContactRelation" character varying,
                "emergencyContactPhone" character varying,
                "oneSignalPlayerId" character varying,
                "phone" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "provider" character varying NOT NULL DEFAULT 'email',
                "socialId" character varying,
                "gender" character varying,
                "birthDate" TIMESTAMP,
                "profession" character varying,
                "profileImageUrl" character varying,
                "hash" character varying,
                "deletedAt" TIMESTAMP,
                "photoId" uuid,
                "roleId" uuid,
                "statusId" uuid,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be4" UNIQUE ("nickname"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

    // Roles tablosu
    await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_roles" PRIMARY KEY ("id")
            )
        `);

    // Statuses tablosu
    await queryRunner.query(`
            CREATE TABLE "statuses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_statuses" PRIMARY KEY ("id")
            )
        `);

    // Files tablosu
    await queryRunner.query(`
            CREATE TABLE "files" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "path" character varying NOT NULL,
                "mimeType" character varying NOT NULL,
                "size" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_files" PRIMARY KEY ("id")
            )
        `);

    // Clubs tablosu
    await queryRunner.query(`
            CREATE TABLE "clubs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "city" character varying NOT NULL,
                "district" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "founderId" uuid,
                CONSTRAINT "PK_clubs" PRIMARY KEY ("id"),
                CONSTRAINT "FK_clubs_founder" FOREIGN KEY ("founderId") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);

    // Club Members tablosu
    await queryRunner.query(`
            CREATE TABLE "club_members" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "role" character varying NOT NULL DEFAULT 'MEMBER',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                "clubId" uuid,
                CONSTRAINT "PK_club_members" PRIMARY KEY ("id"),
                CONSTRAINT "FK_club_members_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_club_members_club" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE
            )
        `);

    // Events tablosu
    await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text,
                "startDate" TIMESTAMP NOT NULL,
                "endDate" TIMESTAMP NOT NULL,
                "location" character varying NOT NULL,
                "maxParticipants" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "creatorId" uuid,
                CONSTRAINT "PK_events" PRIMARY KEY ("id"),
                CONSTRAINT "FK_events_creator" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);

    // Event Participants tablosu
    await queryRunner.query(`
            CREATE TABLE "event_participants" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" character varying NOT NULL DEFAULT 'PENDING',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                "eventId" uuid,
                CONSTRAINT "PK_event_participants" PRIMARY KEY ("id"),
                CONSTRAINT "FK_event_participants_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_event_participants_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE
            )
        `);

    // Products tablosu
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "price" decimal(10,2) NOT NULL,
                "stock" integer NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "createdById" uuid,
                CONSTRAINT "PK_products" PRIMARY KEY ("id"),
                CONSTRAINT "FK_products_creator" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);

    // Orders tablosu
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" character varying NOT NULL DEFAULT 'PENDING',
                "totalAmount" decimal(10,2) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
                CONSTRAINT "FK_orders_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);

    // Teams tablosu
    await queryRunner.query(`
            CREATE TABLE "teams" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_teams" PRIMARY KEY ("id")
            )
        `);

    // Team Members tablosu
    await queryRunner.query(`
            CREATE TABLE "team_members" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "role" character varying NOT NULL DEFAULT 'MEMBER',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                "teamId" uuid,
                CONSTRAINT "PK_team_members" PRIMARY KEY ("id"),
                CONSTRAINT "FK_team_members_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_team_members_team" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE
            )
        `);

    // Invitations tablosu
    await queryRunner.query(`
            CREATE TABLE "invitations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "status" character varying NOT NULL DEFAULT 'PENDING',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "senderUserId" uuid,
                "receiverUserId" uuid,
                CONSTRAINT "PK_invitations" PRIMARY KEY ("id"),
                CONSTRAINT "FK_invitations_sender" FOREIGN KEY ("senderUserId") REFERENCES "users"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_invitations_receiver" FOREIGN KEY ("receiverUserId") REFERENCES "users"("id") ON DELETE SET NULL
            )
        `);

    // Foreign key constraints for users
    await queryRunner.query(`
            ALTER TABLE "users" ADD CONSTRAINT "FK_users_photo" FOREIGN KEY ("photoId") REFERENCES "files"("id") ON DELETE SET NULL;
            ALTER TABLE "users" ADD CONSTRAINT "FK_users_role" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL;
            ALTER TABLE "users" ADD CONSTRAINT "FK_users_status" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE SET NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Foreign key constraints for users
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_photo"`,
    );

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "invitations"`);
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "event_participants"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "club_members"`);
    await queryRunner.query(`DROP TABLE "clubs"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "statuses"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
