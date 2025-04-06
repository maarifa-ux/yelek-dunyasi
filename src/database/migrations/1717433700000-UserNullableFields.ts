import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserNullableFields1717433700000 implements MigrationInterface {
  name = 'UserNullableFields1717433700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Email alanını nullable yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`,
    );

    // firstName alanını nullable yap ve varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstName" SET DEFAULT ''`,
    );

    // lastName alanını nullable yap ve varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "lastName" SET DEFAULT ''`,
    );

    // nickname alanını nullable yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "nickname" DROP NOT NULL`,
    );

    // phoneNumber alanını nullable yap ve varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET DEFAULT ''`,
    );

    // city alanını nullable yap ve varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "city" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "city" SET DEFAULT ''`,
    );

    // district alanını nullable yap ve varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "district" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "district" SET DEFAULT ''`,
    );

    // motorcycleBrand için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "motorcycleBrand" SET DEFAULT ''`,
    );

    // motorcycleModel için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "motorcycleModel" SET DEFAULT ''`,
    );

    // motorcycleCc için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "motorcycleCc" SET DEFAULT 0`,
    );

    // profilePicture için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "profilePicture" SET DEFAULT ''`,
    );

    // emergencyContactName için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "emergencyContactName" SET DEFAULT ''`,
    );

    // emergencyContactRelation için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "emergencyContactRelation" SET DEFAULT ''`,
    );

    // emergencyContactPhone için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "emergencyContactPhone" SET DEFAULT ''`,
    );

    // oneSignalPlayerId için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "oneSignalPlayerId" SET DEFAULT ''`,
    );

    // phone için varsayılan değer ekle
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phone" SET DEFAULT ''`,
    );

    // Enum alanlarını nullable yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "driverLicenseType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "clothingSize" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "bloodType" DROP NOT NULL`,
    );

    // Diğer boolean alanları nullable yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isEmailVerified" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isPhoneVerified" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "hasProfilePicture" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isActive" DROP NOT NULL`,
    );

    // provider alanını nullable yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "provider" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Alanları tekrar NOT NULL yap ve varsayılan değerleri kaldır

    // Email alanını tekrar NOT NULL yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`,
    );

    // firstName alanını tekrar NOT NULL yap ve varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstName" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`,
    );

    // lastName alanını tekrar NOT NULL yap ve varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "lastName" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL`,
    );

    // nickname alanını tekrar NOT NULL yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "nickname" SET NOT NULL`,
    );

    // phoneNumber alanını tekrar NOT NULL yap ve varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phoneNumber" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phoneNumber" SET NOT NULL`,
    );

    // city alanını tekrar NOT NULL yap ve varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "city" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "city" SET NOT NULL`,
    );

    // district alanını tekrar NOT NULL yap ve varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "district" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "district" SET NOT NULL`,
    );

    // motorcycleBrand için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "motorcycleBrand" DROP DEFAULT`,
    );

    // motorcycleModel için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "motorcycleModel" DROP DEFAULT`,
    );

    // motorcycleCc için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "motorcycleCc" DROP DEFAULT`,
    );

    // profilePicture için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "profilePicture" DROP DEFAULT`,
    );

    // emergencyContactName için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "emergencyContactName" DROP DEFAULT`,
    );

    // emergencyContactRelation için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "emergencyContactRelation" DROP DEFAULT`,
    );

    // emergencyContactPhone için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "emergencyContactPhone" DROP DEFAULT`,
    );

    // oneSignalPlayerId için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "oneSignalPlayerId" DROP DEFAULT`,
    );

    // phone için varsayılan değeri kaldır
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phone" DROP DEFAULT`,
    );

    // Enum alanlarını tekrar NOT NULL yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "driverLicenseType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "clothingSize" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "bloodType" SET NOT NULL`,
    );

    // Diğer boolean alanları tekrar NOT NULL yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isEmailVerified" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isPhoneVerified" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "hasProfilePicture" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isActive" SET NOT NULL`,
    );

    // provider alanını tekrar NOT NULL yap
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "provider" SET NOT NULL`,
    );
  }
}
