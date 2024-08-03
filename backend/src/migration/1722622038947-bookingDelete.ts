import { MigrationInterface, QueryRunner } from "typeorm";

export class BookingDelete1722622038947 implements MigrationInterface {
    name = 'BookingDelete1722622038947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "deletedAt"`);
    }

}
