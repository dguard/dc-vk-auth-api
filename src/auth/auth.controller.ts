import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
} from "@nestjs/common";
import { AuthForm, UserForm, AuthVK, IGrant, UserDTO } from "../forms";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {
  }


  @Post("/login/vk")
  async vk(@Body(new ValidationPipe()) auth: AuthVK): Promise<UserDTO> {
    let authData;

    try {
      authData = await this.authService.getVkToken(auth.code);
    } catch (err) {
      console.log(err);
      throw new UnprocessableEntityException("Wrong VK code");
    }

    const _user = await this.userService.findByVkId(authData.user_id);
    console.log(authData.user_id);
    console.log(authData.access_token);
    if (_user) {
      return this.authService.authenticate(_user, true);
    }

    // avoid catching errors
    const { data } = await this.authService.getUserDataFromVk(
      authData.user_id,
      authData.access_token
    );

    const profile = data.response[0];

    let user: UserForm = {
      vk_id: authData.user_id,
      email: authData.email,
      password: null,
      name: `${profile.first_name} ${profile.last_name}`,
      avatar_url: profile.photo_400,
      grant: IGrant.USER,
    };

    await this.userService.create(user);

    var res = this.authService.authenticate(user, true);

    return res;
  }

}