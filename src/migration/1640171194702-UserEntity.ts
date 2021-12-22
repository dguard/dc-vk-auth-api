import {MigrationInterface, QueryRunner} from "typeorm";

export class UserEntity1640171194702 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "vk_id" character varying(300) NOT NULL, "email" character varying(300) NULL, "name" character varying(300) NOT NULL, "password" character varying(300) NULL, "grant" character varying(300) NOT NULL, "avatar_url" character varying(300) NULL, CONSTRAINT "PK_user_entity" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP TABLE "user_entity"`, undefined);
    }

}
