import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable20250318000000 implements MigrationInterface {
    name = 'CreateUserTable20250318000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM ('User', 'GameMaster')
        `);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR UNIQUE NOT NULL,
                "password" VARCHAR NOT NULL,
                "role" "user_role_enum" NOT NULL DEFAULT 'User'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
    }
}