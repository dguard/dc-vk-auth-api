import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
  Put,
  Get,
  Param,
  NotFoundException,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Roles } from "../roles.decorator";
import { RolesGuard } from "../roles.guard";

// import { UserForm } from "../forms";
import { UserEntity } from "../entities";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get("/profile")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles("admin", "user")
  async getProfile(@Request() req): Promise<UserEntity[]> {
    return req.user;
  }

}