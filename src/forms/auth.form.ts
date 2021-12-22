import { IsEmail, IsString } from "class-validator";

export class AuthForm {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthVK {
  code: string;
}
