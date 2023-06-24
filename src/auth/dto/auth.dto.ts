import { IsEmail, IsString, MIN_LENGTH, MinLength } from "class-validator"

export class AuthDto {
  @IsEmail()
  email: string
  @IsString()
  login: string
  @IsString()
  name: string
  @IsString()
  @MinLength(6, {
    message:
      "Слишком короткий пароль. Пароль должен состоять минимум из 6 символов"
  })
  password: string
}
export class LoginDto {
  @IsString()
  emailOrLogin: string
  @IsString()
  password: string
}
