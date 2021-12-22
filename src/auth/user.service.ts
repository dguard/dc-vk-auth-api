import * as bcrypt from "bcrypt";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult, DeleteResult } from "typeorm";

import { UserEntity } from "../entities";
import { UserForm } from "../forms";

@Injectable()
export class UserService {
  private saltRounds: number;

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
    this.saltRounds = 10;
  }

  async create(user: UserForm): Promise<UserEntity> {
    const userToCreate = {
      ...user,
      password: user.password ? await this.getHash(user.password) : null,
    };

    const result = await this.userRepository.save(
      this.userRepository.create(userToCreate)
    );

    return result;
  }

  async update(userEntity: UserEntity, user: UserForm): Promise<UserEntity> {
    return await this.userRepository.save({
      ...userEntity,
      name: user.name,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findByVkId(vk_id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        vk_id,
      },
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneOrFail(id);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async destroy(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async findByEmailWithPassword(email: string): Promise<UserEntity> | null {
    return await this.userRepository.findOne(
      {
        email,
      },
      {
        select: ["email", "password", "id", "grant", "name", "avatar_url"],
      }
    );
  }
}
