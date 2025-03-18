import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCharacterTables1710789600000 implements MigrationInterface {
    name = 'CreateCharacterTables1710789600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing tables if they exist
        await queryRunner.query(`DROP TABLE IF EXISTS "character_items" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "character" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "item" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "character_class" CASCADE`);

        // Create tables in correct order
        await queryRunner.query(`
            CREATE TABLE "character_class" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR UNIQUE NOT NULL,
                "description" TEXT NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "item" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "description" TEXT NOT NULL,
                "bonusStrength" INTEGER NOT NULL DEFAULT 0,
                "bonusAgility" INTEGER NOT NULL DEFAULT 0,
                "bonusIntelligence" INTEGER NOT NULL DEFAULT 0,
                "bonusFaith" INTEGER NOT NULL DEFAULT 0
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "character" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR UNIQUE NOT NULL,
                "health" INTEGER NOT NULL,
                "mana" INTEGER NOT NULL,
                "baseStrength" INTEGER NOT NULL,
                "baseAgility" INTEGER NOT NULL,
                "baseIntelligence" INTEGER NOT NULL,
                "baseFaith" INTEGER NOT NULL,
                "createdBy" INTEGER NOT NULL,
                "characterClassId" INTEGER REFERENCES "character_class"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "character_items" (
                "character_id" INTEGER NOT NULL,
                "item_id" INTEGER NOT NULL,
                PRIMARY KEY ("character_id", "item_id"),
                CONSTRAINT "fk_character_items_character" 
                    FOREIGN KEY ("character_id") 
                    REFERENCES "character"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_character_items_item" 
                    FOREIGN KEY ("item_id") 
                    REFERENCES "item"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "character_items" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "character" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "item" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "character_class" CASCADE`);
    }
}