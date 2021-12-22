import { Module, HttpModule } from "@nestjs/common";
// import { UserModule } from "./../user/user.module";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
// import { ConfigModule, ConfigService } from "nestjs-config";
import { AuthController } from "./auth.controller";
import { UserService } from "./user.service";
import { UserEntity } from "../entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./jwt.strategy";

require('dotenv');

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity]),
    // UserModule,
    // ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secretOrPrivateKey: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES,
          },
        };
      },
      inject: [],
    }),
  ],
  providers: [AuthService, UserService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
