import { Injectable, BadRequestException, HttpService } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "./user.service";
// import { UserEntity } from "../entities";
// import { JwtPayloadInterface } from "./interfaces";
import { AuthForm, UserDTO } from "../forms";
import axios from 'axios';
import { UserEntity } from "../entities";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private http: HttpService
  ) {
  }

  async authenticate(
    auth: AuthForm,
    skipPasswordCheck: boolean = false
  ): Promise<UserDTO> {
    const user = await this.userService.findByEmailWithPassword(auth.email);

    if (!user) {
      throw new BadRequestException();
    }

    const isRightPassword =
      user.password && !skipPasswordCheck
        ? await this.userService.compareHash(auth.password, user.password)
        : true;

    if (!isRightPassword) {
      throw new BadRequestException("Invalid credentials");
    }

    return {
      id: user.id,
      vk_id: user.vk_id,
      email: user.email,
      grant: user.grant,
      name: user.name,
      avatar_url: user.avatar_url,
      token: await this.jwtService.sign({ id: user.id }),
    } as any;
  }

  async getVkToken(code: string): Promise<any> {
    const VKDATA = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    };

    const host =
      process.env.NODE_ENV === "prod"
        ? process.env.APP_HOST
        : process.env.APP_LOCAL;

    return new Promise((resolve, reject) => {
      return axios.get(`https://oauth.vk.com/access_token?client_id=${VKDATA.client_id}&client_secret=${VKDATA.client_secret}&redirect_uri=${host}/signin&code=${code}`, {
        headers: {
          Accept: 'application/json',
        }
      }).then((resp) => {
        return resolve(resp.data);
      }).catch((err) => {
        console.log(err);
        return reject(err);
      })
    });
  }

  async validateUser(payload: any): Promise<UserEntity> {
    return await this.userService.findById(payload.id);
  }

  async getUserDataFromVk(userId: string, token: string): Promise<any> {
    return this.http
      .get(
        `https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_400,has_mobile,home_town,contacts,mobile_phone&access_token=${token}&v=5.120`
      )
      .toPromise();
  }
}