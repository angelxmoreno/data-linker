import { MigrationInterface, QueryRunner } from 'typeorm';
import { TypeOrmDriverBuilder } from '@utils/TypeOrmDriverBuilder';

export class diff1652558861297 implements MigrationInterface {
    name = 'diff1652558861297';

    public up(queryRunner: QueryRunner): Promise<void> {
        const databaseType = TypeOrmDriverBuilder.databaseType();
        if (databaseType === 'mysql') {
            return this.runMysqlUp(queryRunner);
        }

        if (databaseType === 'postgresql') {
            return this.runPostgresUp(queryRunner);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('documents');
        await queryRunner.dropTable('users');

        try {
            await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
        } catch (e) {}
    }

    protected async runPostgresUp(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('consumer', 'publisher', 'guest')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "role" "public"."users_role_enum",
                "api_key" character(64) NOT NULL,
                 "ver" integer NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "users_api_key" ON "users" ("api_key")
        `);
        await queryRunner.query(`
            CREATE TABLE "documents" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "subject_id" character varying(64) NOT NULL,
                "classification" character varying(200) NOT NULL,
                "publisher_id" character(36) NOT NULL,
                "content_type" character varying(200) NOT NULL,
                "file_name" character varying(200) NOT NULL,
                "file_path" text NOT NULL,
                "s3_path" text NOT NULL,
                "ver" integer NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "doc_subject_id" ON "documents" ("subject_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "doc_classification" ON "documents" ("classification")
        `);
        await queryRunner.query(`
            CREATE INDEX "doc_publisher_id" ON "documents" ("publisher_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "doc_content_type" ON "documents" ("content_type")
        `);
    }

    protected async runMysqlUp(queryRunner: QueryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(100) NOT NULL,
                \`role\` enum ('consumer', 'publisher', 'guest') NULL,
                \`api_key\` char(64) NOT NULL,
                 \`ver\` int NOT NULL,
                \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted\` datetime(6) NULL,
                UNIQUE INDEX \`users_api_key\` (\`api_key\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`documents\` (
                \`id\` char(36) NOT NULL,
                \`subject_id\` varchar(64) NOT NULL,
                \`classification\` varchar(200) NOT NULL,
                \`publisher_id\` char(36) NOT NULL,
                \`content_type\` varchar(200) NOT NULL,
                \`file_name\` varchar(200) NOT NULL,
                \`file_path\` text NOT NULL,
                \`s3_path\` text NOT NULL,
                \`ver\` int NOT NULL,
                \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted\` datetime(6) NULL,
                INDEX \`doc_subject_id\` (\`subject_id\`),
                INDEX \`doc_classification\` (\`classification\`),
                INDEX \`doc_publisher_id\` (\`publisher_id\`),
                INDEX \`doc_content_type\` (\`content_type\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }
}
